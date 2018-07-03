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
    "variable-name": [true, "ban-keywords", "check-format", "allow-pascal-case"]
  }
};
