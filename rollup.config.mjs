import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/simple-file-encryption.js",
                format: "cjs",
            },
            {
                file: "dist/simple-file-encryption.mjs",
                format: "es",
            },
            {
                file: "dist/simple-file-encryption.min.js",
                format: "cjs",
                plugins: [terser()],
            },
            {
                file: "dist/simple-file-encryption.min.mjs",
                format: "es",
                plugins: [terser()],
            },
            {
                file: "dist/simple-file-encryption.browser.js",
                format: "iife",
                name: "SimpleFileEncryption",
                plugins: [terser()],
            },
        ],
        plugins: [typescript()],
    },
    {
        input: "./dist/.dts/index.d.ts",
        output: [{ file: "dist/simple-file-encryption.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
