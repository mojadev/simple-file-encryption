import { KeyType, unpackContainer } from "./container";
import { importPrivateKey } from "./rsa-key";
import {
    AESKey,
    EncryptedPayload,
    InitializationVector,
    PrivateKey,
    PrivateKeyPCKS8String,
    Secret,
} from "./types";

/**
 * Decrypts a file using the provided private key.
 *
 * @param {File} file - The file to be decrypted.
 * @param {string} privateKey - The private key used for decryption.
 * @return {Promise<File>} - A promise that resolves to the decrypted file.
 */
export async function decryptFile(
    file: File,
    privateKey: PrivateKeyPCKS8String
): Promise<File> {
    const key = await importPrivateKey(privateKey);
    const fileBuffer = await file.arrayBuffer();
    const { key: encryptedKey, payload: encryptedPayload } =
        unpackContainer(fileBuffer);

    const aesSecret = await decryptAESSecret(key, encryptedKey);
    const aesKey = await createAESKey(aesSecret);
    const decryptedPayload = await decryptPayload(
        encryptedKey.iv,
        aesKey,
        encryptedPayload
    );

    return new File([decryptedPayload], file.name, { type: file.type });
}

async function decryptPayload(
    iv: InitializationVector,
    aesKey: AESKey,
    encryptedPayload: EncryptedPayload
) {
    try {
        return await globalThis.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv,
            },
            aesKey,
            encryptedPayload
        );
    } catch (e) {
        throw new Error("Could not decrypt payload: " + e);
    }
}

async function createAESKey(aesSecret: Secret) {
    try {
        return await globalThis.crypto.subtle.importKey(
            "raw",
            aesSecret,
            { name: "AES-CBC", length: 512 },
            false,
            ["decrypt"]
        );
    } catch (e) {
        throw new Error("Could not create crypto key from AES secret " + e);
    }
}

async function decryptAESSecret(key: PrivateKey, encryptedKey: KeyType) {
    try {
        return await globalThis.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            key,
            encryptedKey.key
        );
    } catch (e) {
        throw new Error(
            "Could not decrypt secret (is your private key correct?): " + e
        );
    }
}
