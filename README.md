# Simple public/private key file encryption 🔑

Encrypt and decrypt files in your browser using the WebCrypto API.

-   Simple API
-   Zero dependencies
-   Browser native features

This project aims at simplicity: You don't get a lot of options, but it's dead simple to encrypt and decrypt a file using Public/Private keys.

```typescript
const encrypted = await encryptFile(file, publicKey);
const decrypted = await decryptFile(encrypted, privateKey);
```

> _Disclaimer_: I am not a security expert and this project has no security audits. Do not use it if leaking information would put your personal safety at risk.

## Background

The original use case for this library was a service that supported file uploads, but made these files public under a non-guessable link.
Encrypting the files added an extra layer of protection in case an URL is leaked accidentally or intentionally.

## How it works

Encryption works by encrypting the whole message with AES-CBC and a random key. The key is then encrypted using a provided public key.
The result is packed in the following format:

`| 4 Bytes | 16 Bytes | <Keylength> Bytes | Rest of buffer    |`\
`
| Keylength | AES IV | Encrypted AES Key | Encrypted Payload |`
`

### Encryption

![Encryption schema](https://github.com/mojadev/simple-file-encryption/raw/main/doc/encrypt.png)

### Decryption

![Decryption schema](https://github.com/mojadev/simple-file-encryption/raw/main/doc/decrypt.png)

## Usage

1. Install the package

```sh
npm install simple-file-encryption
```

2. Encrypt a file

```ts
import { encryptFile } from "simple-file-encryption";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAx0Vy
<...snip...>
+1u67KNkH3KWb6hBk2Meg6QvhrRNszGcI5GxAgMBAAE=
-----END PUBLIC KEY-----`

const file: File = //... a file from a form

/** Result is a file object **/
const result = await encryptFile(file, publicKey);

```

3. Decrypt a file

```ts
import { decryptFile } from "simple-file-encryption";

/** Make sure this key is not shared **/
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIG/QIBADANBgkqhkiG9w0BAQEFAASCBucwggbjAgEAAoIBgQDHRXLoudUu5afI
<...snip...>
+1u67KNkH3KWb6hBk2Meg6QvhrRNszGcI5GxAgMBAAE=
-----END PRIVATE KEY-----`

const file: File = //... a file from a form

/** Result is a file object **/
const plainText = await decryptFile(file, privateKey);

```

You can also [take a look at the decrypt test for a full example](./src/decrypt.test.ts).

## Supported key formats

The private key needs to be in pcks#8 format, while the public key should be in spki format.
You can run

```
npm run genkeys
```

in order to create a matching public/private key pair.
Take a look at [the rsa-keys module](./src/rsa-key.ts) if you encounter issues with you key, in my
tests WebCrypto was quite picky.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
