import { expect } from "@esm-bundle/chai";
import { IV_LENGTH, PREFIX_LENGTH } from "./config";
import { packContainer, unpackContainer } from "./container";

it("should pack the key and payload into a single buffer", () => {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = crypto.getRandomValues(new Uint8Array(328));
    const payload = crypto.getRandomValues(new Uint8Array(1024));

    const container = packContainer({ key, iv }, payload);

    const keyLength = new Uint32Array(container)[0];

    expect(keyLength).to.equal(key.byteLength);
    expect(container.byteLength).to.equal(
        PREFIX_LENGTH + key.byteLength + payload.byteLength + IV_LENGTH
    );
});

it("should unpack a container into key, iv and payload", () => {
    const expectedIv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const expectedKey = crypto.getRandomValues(new Uint8Array(328));
    const expectedPayload = crypto.getRandomValues(new Uint8Array(1024));

    const container = packContainer(
        { key: expectedKey, iv: expectedIv },
        expectedPayload
    );
    const { key, payload } = unpackContainer(container);

    expect(key.iv.toString()).to.eq(expectedIv.toString(), "iv didn't match");
    expect(key.key.toString()).to.eq(
        expectedKey.toString(),
        "key didn't match"
    );
    expect(payload.toString()).to.eq(
        expectedPayload.toString(),
        "payload didn't match"
    );
});
