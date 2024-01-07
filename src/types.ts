/**
 * Represents an AES key.
 */
export type AESKey = CryptoKey;

/**
 * Represents a secret.
 */
export type Secret = ArrayBuffer;

/**
 * Represents a private key.
 */
export type PrivateKey = CryptoKey;

/**
 * Represents a public key.
 */
export type PublicKey = CryptoKey;

/**
 * Represents a plaintext payload.
 */
export type PlaintextPayload = ArrayBuffer;

/**
 * Represents an encrypted payload.
 */
export type EncryptedPayload = ArrayBuffer;

/**
 * Represents an encrypted key.
 */
export type EncryptedKey = ArrayBuffer;

/**
 * Represents an initialization vector used for AES encryption.
 */
export type InitializationVector = Uint8Array;

/**
 * Represents a container buffer.
 */
export type ContainerBuffer = ArrayBuffer;

/**
 * Represents a private key in PKCS8 string format.
 *
 */
export type PrivateKeyPCKS8String = string;

/**
 * Represents a public key in PEM string format.
 */
export type PublicKeyPEMString = string;
