module.exports = {
  "extends": "tslint-config-airbnb",
  "rules": {
    "align": [false],
    "object-shorthand-properties-first": { 
        "severity": "off"
    },
    "ter-arrow-parens": [true, "always"],
    "arrow-parens": true,
    "trailing-comma": [true, {
      "multiline": {
        "objects": "always",
        "arrays": "always",
        "functions": "never",
        "typeLiterals": "ignore"
      },
      "esSpecCompliant": true
    }]
  }
};
