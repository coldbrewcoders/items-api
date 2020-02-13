module.exports = {
  "parser": "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "plugins": [
    "babel",
    "@typescript-eslint",
    "import",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    {
      "files": ["*.js"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": 0
      }
    },
    {
      "files": ["*.ts", ".tsx"],
      "rules": {
        "no-undef": 0,
        "import/no-unresolved": 0,
        "import/namespace": 0,
        "import/named": 0,
        "import/default": 0
      }
    }
  ],
  "parserOptions": {
  "ecmaFeatures": {
    "impliedStrict": true,
  },
  "ecmaVersion": 2018,
  "sourceType": "module"
  },
  "rules": {
    // General Rules
    "no-console": 0,
    "no-debugger": 0,
    "eqeqeq": ["error","always"],
    "spaced-comment": ["error", "always"],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "no-var": "error",
    "no-extra-semi": "error",
    "no-unused-vars": "error",
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "jsx-quotes":["error", "prefer-double"],
    "no-mixed-spaces-and-tabs": "error",

    // Typescript rules
    "@typescript-eslint/interface-name-prefix": ["warn", { "prefixWithI": "always" }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-inferrable-types": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
  },
  "settings": {
    "import/resolver": {
      "babel-module": {},
      "node": {
        "extensions": [
          ".js",
          ".ts",
        ]
      }
    }
  }
}