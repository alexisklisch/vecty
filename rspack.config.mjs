import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from "@rspack/cli";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* export default {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /test/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: 'vecty.bundle.js',
    library: {
      type: 'commonjs2',       // o 'commonjs2', según tus necesidades
      export: 'default', // desempaqueta el default export
    },
    globalObject: 'global'
  },
}; */


// rspack.config.mjs


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

