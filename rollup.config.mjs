import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

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
];
