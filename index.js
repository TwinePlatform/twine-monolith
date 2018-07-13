module.exports = {
  "extends": "tslint-config-airbnb",
  "rules": {
    "align": [false],
    "object-shorthand-properties-first": {
      "severity": "off"
    },
    "ter-arrow-parens": [true, "always"],
    "arrow-parens": true,
    "no-else-after-return": false,
    "trailing-comma": [true, {
      "multiline": {
        "objects": "always",
        "arrays": "always",
        "functions": "never",
        "typeLiterals": "ignore"
      },
      "esSpecCompliant": true
    }],
    "no-consecutive-blank-lines": [true, 2],
    "variable-name": [true, "ban-keywords", "check-format", "allow-pascal-case"],
    "import-name": false,
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-module",
      "check-separator",
      "check-rest-spread",
      "check-type",
      "check-typecast",
      "check-type-operator",
      "check-preblock"
    ],
    "no-unused-variable": true,
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        "parameter": "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      },
      {
        "call-signature": "onespace",
        "index-signature": "onespace",
        "parameter": "onespace",
        "property-declaration": "onespace",
        "variable-declaration": "onespace"
      }
    ],
    "space-before-function-paren": [true, {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "always",
      "method": "always",
      "constructor": "always"
    }],
    "object-curly-spacing": [true, "always"],
    "no-multi-spaces": true
  }
};
