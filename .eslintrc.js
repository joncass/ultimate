module.exports = {
    "extends": "google",
    "installedESLint": true,
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "brace-style": ["error", "stroustrup"],
        "guard-for-in": "off",
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "max-len": "off",
        "max-statements-per-line": ["error", { "max": 2 }],
        "no-console": "off",
        "no-warning-comments": "off",
        "object-curly-spacing": ["error", "always"],
        "padded-blocks": "off",
        "prefer-const": ["error"],
        "require-jsdoc": "off"
    }

};
