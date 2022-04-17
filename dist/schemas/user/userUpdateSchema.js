"use strict";
exports.__esModule = true;
/**
 * The UserUpdateSchema provides the ability to update all values associated with a user account.
 */
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var ajv = new ajv_1["default"]();
(0, ajv_formats_1["default"])(ajv, ["email", "password"]);
;
;
;
;
var schema = {
    type: "object",
    properties: {
        user_account: {
            $id: "#/properties/user_account",
            type: "object",
            nullable: true,
            properties: {
                password: {
                    $id: "#/properties/user_account/properties/password",
                    type: "string",
                    format: "password",
                    "default": "",
                    minLength: 8,
                    nullable: true
                }
            },
            required: []
        },
        user_profile: {
            $id: "#/properties/user_profile",
            type: "object",
            nullable: true,
            properties: {
                username: {
                    $id: "#/properties/user_profile/properties/username",
                    type: "string",
                    "default": "",
                    minLength: 4,
                    nullable: true,
                    pattern: "^[A-z0-9]+$"
                },
                username_clean: {
                    $id: "#/properties/user_profile/properties/username_clean",
                    type: "string",
                    "default": "",
                    minLength: 4,
                    nullable: true,
                    pattern: "^[a-z0-9]+$"
                },
                headline: {
                    $id: "#/properties/user_profile/properties/headline",
                    type: "string",
                    nullable: true
                },
                about: {
                    $id: "#/properties/user_profile/properties/about",
                    type: "string",
                    nullable: true
                },
                image_url: {
                    $id: "#/properties/user_profile/properties/image_url",
                    type: "string",
                    nullable: true
                },
                public: {
                    $id: "#/properties/user_profile/properties/public",
                    type: "boolean",
                    "default": false,
                    nullable: true
                }
            },
            required: []
        },
        user_data: {
            $id: "#/properties/user_data",
            type: "object",
            nullable: true,
            properties: {
                email: {
                    $id: "#/properties/user_data/properties/email",
                    type: "string",
                    format: "email",
                    "default": "",
                    minLength: 6,
                    nullable: true
                },
                email_clean: {
                    $id: "#/properties/user_data/properties/email_clean",
                    type: "string",
                    format: "email",
                    "default": "",
                    minLength: 6,
                    nullable: true
                },
                public_email: {
                    $id: "#/properties/user_data/properties/public_email",
                    type: "boolean",
                    "default": false,
                    nullable: true
                },
                first_name: {
                    $id: "#/properties/user_data/properties/first_name",
                    type: "string",
                    nullable: true
                },
                public_first_name: {
                    $id: "#/properties/user_data/properties/public_first_name",
                    type: "boolean",
                    "default": true,
                    nullable: true
                },
                last_name: {
                    $id: "#/properties/user_data/properties/last_name",
                    type: "string",
                    nullable: true
                },
                public_last_name: {
                    $id: "#/properties/user_data/properties/public_last_name",
                    type: "boolean",
                    "default": false,
                    nullable: true
                },
                location: {
                    $id: "#/properties/user_data/properties/location",
                    type: "string",
                    nullable: true
                },
                public_location: {
                    $id: "#/properties/user_data/properties/public_location",
                    type: "boolean",
                    "default": false,
                    nullable: true
                }
            },
            required: []
        }
    },
    required: [],
    additionalProperties: true
};
// export interface UserUpdateProps {
//     username?: string
//     email?: string
//     password?: string
//     first_name?: string
//     last_name?: string
// };
// const schema: JSONSchemaType<UserUpdateProps> = {
//     type: "object",
//     properties: {
//         username: {
//             $id:"#/properties/username",
//             type: "string",
//             default: "",
//             minLength: 1,
//             nullable: true
//         },
//         email: {
//             $id: "#/properties/email",
//             type: "string",
//             format: "email",
//             default: "",
//             minLength: 1,
//             nullable: true
//         },
//         password: {
//             $id: "#/properties/password",
//             type: "string",
//             format: "password",
//             default: "",
//             minLength: 8,
//             nullable: true
//         },
//         first_name: {
//             $id:"#/properties/first_name",
//             type: "string",
//             nullable: true
//         },
//         last_name: {
//             $id:"#/properties/last_name",
//             type: "string",
//             nullable: true
//         }
//     },
//     required: [],
//     additionalProperties: true
// };
var validateUserUpdateSchema = ajv.compile(schema);
exports["default"] = validateUserUpdateSchema;
//# sourceMappingURL=userUpdateSchema.js.map