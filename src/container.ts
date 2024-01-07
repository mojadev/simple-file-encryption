/**
 * File container for the encrypted payload.
 */

import { IV_LENGTH, PREFIX_LENGTH } from "./config";
import {
    ContainerBuffer,
    EncryptedKey,
    EncryptedPayload,
    InitializationVector,
} from "./types";

/**
 * Pack the key and payload into a single buffer.
 *
 * @returns
 */
export const packContainer = (
    { key, iv }: KeyType,
    payload: EncryptedPayload
): ContainerBuffer => {
    const result = new ArrayBuffer(
        PREFIX_LENGTH + IV_LENGTH + key.byteLength + payload.byteLength
    );
    const resultView = new Uint8Array(result);
    const prefix = new Uint32Array(result, 0, 1);

    prefix[0] = key.byteLength;
    resultView.set(iv, PREFIX_LENGTH);
    resultView.set(new Uint8Array(key), PREFIX_LENGTH + IV_LENGTH);
    resultView.set(
        new Uint8Array(payload),
        key.byteLength + PREFIX_LENGTH + IV_LENGTH
    );

    return result;
};

export const unpackContainer = (
    payload: ContainerBuffer
): { key: KeyType; payload: EncryptedPayload } => {
    const prefix = new Uint32Array(payload)[0];
    const iv = new Uint8Array(payload, 4, 16);
    const encryptedKey = new Uint8Array(payload, 4 + 16, prefix);
    const encryptedPayload = new Uint8Array(payload, 4 + prefix + 16);

    return { key: { iv, key: encryptedKey }, payload: encryptedPayload };
};

export interface KeyType {
    iv: InitializationVector;
    key: EncryptedKey;
}
