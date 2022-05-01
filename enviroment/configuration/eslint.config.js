module.exports = {
    "root": true,
    "parserOptions": {
        "project": "../../tsconfig.json",
        "tsconfigRootDir": __dirname
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "ignorePatterns": [
        "node_modules/",
        "Library/",
        "Scratchpad/",
        "**/*.js"
    ],
    "rules": {
        "no-return-await": "warn",
        "@typescript-eslint/explicit-module-boundary-types": [
            "warn",
            {
                "allowArgumentsExplicitlyTypedAsAny": true
            }
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "args": "none",
                "ignoreRestSiblings": false
            }
        ],
        "@typescript-eslint/triple-slash-reference": "warn",
        "@typescript-eslint/no-namespace": "warn",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/promise-function-async": "warn",
        "@typescript-eslint/await-thenable": "warn",
        "curly": "warn",
        "@typescript-eslint/array-type": [
            "warn",
            {
                "default": "generic",
                "readonly": "generic"
            }
        ],
        "semi": [
            "warn",
            "always"
        ],
        "@typescript-eslint/no-for-in-array": "warn",
        "no-var": "warn",
        "eqeqeq": "warn",
        "valid-typeof": "warn",
        "prefer-const": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "new-parens": "warn",
        "no-caller": "warn",
        "no-console": "warn",
        "quotes": [
            "warn",
            "single",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "@typescript-eslint/ban-types": [
            "warn",
            {
                "types": {
                    "String": {
                        "message": "Use string instead",
                        "fixWith": "string"
                    },
                    "Number": {
                        "message": "Use number instead",
                        "fixWith": "number"
                    },
                    "Boolean": {
                        "message": "Use boolean instead",
                        "fixWith": "boolean"
                    },
                    "Object": {
                        "message": "Use object instead",
                        "fixWith": "object"
                    },
                    "Function": {
                        "message": "Ban types"
                    }
                },
                "extendDefaults": false
            }
        ],
        "@typescript-eslint/member-ordering": [
            "warn",
            {
                "default": {
                    "order": "alphabetically",
                    "memberTypes": [
                        // Index signature
                        "signature",

                        // Static Fields
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",

                        // Static accessors.
                        ["public-static-get", "public-static-set"],
                        ["private-static-get", "private-static-set"],
                        ["protected-static-get", "protected-static-set"],

                        // Static methods
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",

                        // Fields             
                        "public-decorated-field",
                        "protected-decorated-field",
                        "private-decorated-field",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "public-abstract-field",
                        "protected-abstract-field",
                        "private-abstract-field",

                        // Accessors.
                        ["public-decorated-get", "public-decorated-set"],
                        ["protected-decorated-get", "protected-decorated-set"],
                        ["private-decorated-get", "private-decorated-set"],
                        ["public-instance-get", "public-instance-set"],
                        ["protected-instance-get", "protected-instance-set"],
                        ["private-instance-get", "private-instance-set"],
                        ["public-abstract-get", "public-abstract-set"],
                        ["protected-abstract-get", "protected-abstract-set"],
                        ["private-abstract-get", "private-abstract-set"],

                        // Constructors
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",

                        // Methods          
                        "public-decorated-method",
                        "public-instance-method",
                        "protected-instance-method",
                        "protected-decorated-method",
                        "private-decorated-method",
                        "private-instance-method",

                        // Abstract methods
                        "public-abstract-method",
                        "protected-abstract-method",
                        "private-abstract-method"
                    ]
                },
                interfaces: ['signature', 'field', 'constructor', 'method'],
                typeLiterals: ['signature', 'field', 'constructor', 'method'],
            }
        ],
        "@typescript-eslint/naming-convention": [
            // Default
            "warn",
            {
                "selector": "default",
                "format": ["strictCamelCase"]
            },

            // Variables and functions
            {
                "selector": ["variable", "function"],
                "prefix": ["l"],
                "format": ["StrictPascalCase"],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": ["variable", "function"],
                "prefix": ["g"],
                "format": ["StrictPascalCase"],
                "leadingUnderscore": "forbid",
                "modifiers": ["global"]
            },
            {
                "selector": ["variable", "function"],
                "format": ["StrictPascalCase"],
                "modifiers": ["exported"]
            },

            // Parameter
            {
                "selector": "parameter",
                "filter": {
                    "regex": "^this$",
                    "match": true,
                },
                "format": ["strictCamelCase"],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "parameter",
                "prefix": ["p"],
                "format": ["StrictPascalCase"],
                "leadingUnderscore": "allow"
            },

            // Class properties
            {
                "selector": "classProperty",
                "prefix": ["m"],
                "format": ["StrictPascalCase"]
            },
            {
                "selector": "classProperty",
                "format": ["strictCamelCase"],
                "modifiers": ["protected"]
            },
            {
                "selector": "classProperty",
                "format": ["strictCamelCase"],
                "modifiers": ["public"]
            },
            {
                "selector": "classProperty",
                "format": ["UPPER_CASE"],
                "modifiers": ["static", "readonly"]
            },

            // Class accessors and methods
            {
                "selector": ["accessor", "classMethod"],
                "format": ["strictCamelCase"]
            },

            // Object literal
            {
                "selector": "objectLiteralProperty",
                "format": null
            },

            // Class, Type alias and Enum
            {
                "selector": ["class", "typeAlias", "enum"],
                "format": ["StrictPascalCase"]
            },

            // Interface
            {
                "selector": "interface",
                "format": ["StrictPascalCase"],
                "prefix": ["I"],
                "filter": {
                    "regex": "^I[A-Z]",
                    "match": true
                }
            },
            {
                "selector": "interface",
                "format": ["StrictPascalCase"],
                "filter": {
                    "regex": "^I[A-Z]",
                    "match": false
                }
            },

            //  Generic
            {
                "selector": "typeParameter",
                "prefix": ["T"],
                "format": ["StrictPascalCase"],
            },

            // Type member
            {
                "selector": ["typeMethod", "typeProperty"],
                "format": ["strictCamelCase"]
            },

            // Enum member
            {
                "selector": ["enumMember"],
                "format": ["StrictPascalCase"]
            },

            // No restriction
            {
                "selector": ["parameterProperty", "objectLiteralProperty", "objectLiteralMethod"],
                "format": null
            },
        ],
        "max-classes-per-file": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "no-conditional-assignment": "off",
        "no-consecutive-blank-lines": "off",
        "no-angle-bracket-type-assertion": "off",
        "no-string-literal": "off",
        "no-bitwise": "off",
        "@typescript-eslint/no-this-alias": "off",
        "no-use-before-declare": "off",
        "no-prototype-builtins": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
};