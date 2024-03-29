import { encryptFile } from "./encrypt";
import { decryptFile } from "./decrypt";
import { expect } from "chai";

it("encrypts and decrypts the same file properly", async () => {
    const publicKey = `-----BEGIN PUBLIC KEY-----
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

    const privateKey = `-----BEGIN PRIVATE KEY-----
    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
    Cg7AnGcdNPTl4vDiKdaybg8=
    -----END PRIVATE KEY-----`;

    // For this example, we'll just use some sample text file
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const encrypted = await encryptFile(file, publicKey);
    const decrypted = await decryptFile(encrypted, privateKey);

    const decryptedFileContent = await new Response(decrypted).text();

    // Our expectation is that we get back the same file content
    expect(decryptedFileContent).to.eq("test");
});
