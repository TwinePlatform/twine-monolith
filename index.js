module.exports = {
  "extends": "tslint-config-airbnb",
  "env": {
    "node": true,
    "jest": true
  },
  "rules": {
    "semi": [ "error", "always" ],
    "brace-style": [ "error", "1tbs" ],
    "padded-blocks": "off",
    "comma-dangle": [ "error", "always-multiline" ],
    "arrow-parens": [ "error", "always" ],
    "consistent-return": "off",
    "no-confusing-arrow": "off",
    "no-shadow": "off",
    "no-prototype-builtins": "off",
    "camelcase": "off",
  }
};
