import { expect } from "chai";
import { encryptFile } from "./encrypt";

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAx0Vy6LnVLuWnyJjIEFwF
IcCDlasXRAjr6pryKaLCtI4HFsyVF4XiMIacRhyUOXEUfgHgCRJmWDrQIynbRvQr
EnmWyvX9w1plLFg5MrqnQzfaJ8ii0Bi0DuDQJxxLJdXSrjY7DxeWujg3UGzl8BIG
bMAV1u/heDp61J3HvB7iyyxwYGPM5LnsSXldG5c+orVNp4lp8y1pGB5JSkFDPL7N
vkT7tA6sV71TWFAkqdDYF70lWcGvQR6c+y4fAeFwyEIgDlXexz+YNaHc7xQILOI1
hNnVhTBZ6PTDc3cVYta2ITYLEOx1vXc10b1Kt8sIzKWNaZDxhRyf3c8ZznaKlBxq
FLJ05pj1RvobzPVRYg1uIUHy35ZQWszPkMwrrug6EcKT968YVMYrYb1xQt0I9SeT
WCjFusXebeNeFF5n93e1A2aB6iovvXE9KJDSnIzHOfACtNHIHAFJVoD2p/r5Otrw
5nKFFkAt+1u67KNkH3KWb6hBk2Meg6QvhrRNszGcI5GxAgMBAAE=
-----END PUBLIC KEY-----
`;

describe("Encryption class", () => {
    it("should not return the plaintext file after encrypting", async () => {
        const file = new File(["Lorem Ipsum"], "lorem.txt", {
            type: "application/text",
        });

        const result = await encryptFile(file, publicKey);
        const plainText = await file.arrayBuffer();
        const encrypted = await result.arrayBuffer();

        expect(new Uint8Array(plainText).toString()).not.to.equal(
            new Uint8Array(encrypted).toString()
        );
    });

    it("should set the size of the key as the prefix", async () => {
        const file = new File(["Lorem Ipsum"], "lorem.txt", {
            type: "application/text",
        });

        const result = await encryptFile(file, publicKey);
        const encrypted = await result.arrayBuffer();

        const size = new Uint32Array(encrypted)[0];

        expect(size).to.eq(384);
    });
});
