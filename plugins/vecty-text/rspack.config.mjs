import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from "@rspack/cli";
import { dependencies } from './package.json' with {type: 'json'}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const externals = Object.keys(dependencies)

const base = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript"
                }
              }
            }
          }
        ]
      }
    ]
  }
};

export default [
  defineConfig({
    ...base,
    externals,
    output: {
      path: resolve(__dirname, "dist/cjs"),
      filename: "main.js",
      library: {
        type: "commonjs2",
        export: "default"
      }
    }
  }),
  defineConfig({
    ...base,
    externals,
    output: {
      path: resolve(__dirname, "dist/mjs"),
      filename: "main.js",
      library: {
        type: "module"
      },
      environment: {
        module: true
      }
    },
    experiments: {
      outputModule: true
    }
  })
];

