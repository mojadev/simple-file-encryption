import { RSA_HASH } from "./config";
import {
    PrivateKey,
    PrivateKeyPCKS8String,
    PublicKey,
    PublicKeyPEMString,
} from "./types";

/**
 * Imports a public key from a PEM string.
 *
 * @param {string} pem - The PEM string containing the public key.
 * @return {Promise<CryptoKey>} A promise that resolves with the imported public key.
 */
export async function importPublicKey(
    pem: PublicKeyPEMString
): Promise<PublicKey> {
    try {
        const pemHeader = /-+BEGIN.*KEY-+/;
        const pemFooter = /-+END.*KEY-+/;
        const pemContents = pem
            .replace(pemHeader, "")
            .replace(pemFooter, "")
            .replace(/\n/g, "")
            .trim();

        const binaryKey = str2ab(window.atob(pemContents));

        return crypto.subtle.importKey(
            "spki",
            binaryKey,
            { name: "RSA-OAEP", hash: RSA_HASH },
            true,
            ["encrypt"]
        );
    } catch (e) {
        throw Error("Could not import public key: " + e);
    }
}

/**
 * Import a private key for decryption of a message.
 *
 * The key has to be in pkcs8 format.
 *
 * @param pcks8
 * @returns
 */
export async function importPrivateKey(
    pcks8: PrivateKeyPCKS8String
): Promise<PrivateKey> {
    try {
        const pemHeader = /-+BEGIN.*KEY-+/;
        const pemFooter = /-+END.*KEY-+/;
        const pemContents = pcks8
            .replace(pemHeader, "")
            .replace(pemFooter, "")
            .replace(/(\n| )/g, "")
            .trim();

        const binaryKey = str2ab(window.atob(pemContents));

        return await window.crypto.subtle.importKey(
            "pkcs8",
            binaryKey,
            { name: "RSA-OAEP", hash: "SHA-512" },
            false,
            ["decrypt"]
        );
    } catch (e) {
        throw new Error("Could not import private key" + e);
    }
}

function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
