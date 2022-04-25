// eslint-disable-next-line node/no-unpublished-require
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@sparticuz/eslint-config"],
  settings: {
    node: {
      allowModules: ["ava"],
    },
  },
};
