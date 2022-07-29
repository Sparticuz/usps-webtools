// eslint-disable-next-line node/no-unpublished-require
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@sparticuz/eslint-config"],
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  rules: {
    "dot-notation": "off",
  },
  settings: {
    node: {
      allowModules: ["ava"],
    },
  },
};
