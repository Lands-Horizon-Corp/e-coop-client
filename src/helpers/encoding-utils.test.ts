import { describe, expect, it } from "vitest";
import { toBase64 } from "./encoding-utils";

describe("toBase64", () => {
    it("should encode a string to Base64", () => {
        const input = "Hello, World!";
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });

    it("should encode an object to Base64", () => {
        const input = { key: "value" };
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });

    it("should encode an array to Base64", () => {
        const input = [1, 2, 3];
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });

    it("should encode a number to Base64", () => {
        const input = 123;
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });

    it("should encode a boolean to Base64", () => {
        const input = true;
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });

    it("should encode null to Base64", () => {
        const input = null;
        const expectedOutput = btoa(JSON.stringify(input));
        expect(toBase64(input)).toBe(expectedOutput);
    });
});
