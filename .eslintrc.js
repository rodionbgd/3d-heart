module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    rules: {
        "comma-dangle": "error",
        "no-prototype-builtins": "off",
        "no-unused-vars": ["error", {"args": "after-used"}],
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                singleQuote: true,
                arrowParens: "avoid",
                pugAttributeSeparator: "none",
                trailingComma: "none",
            }
        ],
        "prefer-destructuring": [
            "error",
            {
                object: true,
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": true
        }]
    },
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [".js"],
            }
        }
    },
    "plugins": [
        "prettier"
    ]
};
