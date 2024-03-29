import { AES_ALGO, AES_KEY_SIZE, IV_LENGTH } from "./config";
import { packContainer } from "./container";
import { importPublicKey } from "./rsa-key";
import { AESKey, PlaintextPayload, PublicKeyPEMString, Secret } from "./types";

/**
 * Encrypt the given file with the provided public key.
 *
 * @param file
 * @param publicKey
 * @returns
 */
export async function encryptFile(
    file: File,
    publicKey: PublicKeyPEMString
): Promise<File> {
    const buffer = await file.arrayBuffer();
    const key = await importPublicKey(publicKey);

    const [inlineKey, rawKey] = await generateSymmetricKey();
    const { encryptedPayload, iv } = await encryptPayload(inlineKey, buffer);

    const encryptedKey = await crypto.subtle.encrypt(
        "RSA-OAEP",
        key,
        new Uint8Array(rawKey)
    );

    const result = packContainer(
        { key: new Uint8Array(encryptedKey), iv },
        encryptedPayload
    );
    return new File([result], file.name, { type: file.type });
}

/**
 * Encrypt the given buffer using the provided symmetric key.
 *
 * @param inlineKey the AESKey to use for encrypting
 * @param buffer    the buffer that should be encrypted
 */
async function encryptPayload(inlineKey: AESKey, buffer: PlaintextPayload) {
    try {
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        const encryptedPayload = await crypto.subtle.encrypt(
            { name: AES_ALGO, iv },
            inlineKey,
            new Uint8Array(buffer)
        );
        return { encryptedPayload, iv };
    } catch (e) {
        throw Error("Could not encrypt payload: " + e);
    }
}

/**
 * Generate a random symmetric key that can be used for encrypting and decrypting.
 *
 * The return type contains the CryptoKey and the ArrayBuffer for convenience.
 *
 * @returns A tuple containing the crypto key and it's raw (arraybuffer) representation
 */
async function generateSymmetricKey(): Promise<[AESKey, Secret]> {
    try {
        const cryptoKey = await crypto.subtle.generateKey(
            { name: AES_ALGO, length: AES_KEY_SIZE },
            true,
            ["encrypt", "decrypt"]
        );

        const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);
        return [cryptoKey, exportedKey];
    } catch (e) {
        throw Error("Could not generate AES key: " + e);
    }
}
