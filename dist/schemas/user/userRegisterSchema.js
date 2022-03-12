"use strict";
exports.__esModule = true;
/**
 * The UserRegisterSchema validates inputs sent during the user registration process.  The user is required to provide a unique username,
 * email address, and password for their account.  The register stop additionally provides the opportunity to enter a first and last
 * name which will be associated with the account.  Other user information will be collected separately from registration.
 */
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var ajv = new ajv_1["default"]();
(0, ajv_formats_1["default"])(ajv, ["email", "password"]);
;
var schema = {
    type: "object",
    properties: {
        username: {
            $id: "#/properties/username",
            type: "string",
            "default": "",
            minLength: 1
        },
        email: {
            $id: "#/properties/email",
            type: "string",
            format: "email",
            "default": "",
            minLength: 1
        },
        password: {
            $id: "#/properties/password",
            type: "string",
            format: "password",
            "default": "",
            minLength: 8
        },
        first_name: {
            $id: "#/properties/first_name",
            type: "string",
            nullable: true
        },
        last_name: {
            $id: "#/properties/last_name",
            type: "string",
            nullable: true
        }
    },
    required: [
        "username", "email", "password"
    ],
    additionalProperties: true
};
var validateUserRegisterSchema = ajv.compile(schema);
exports["default"] = validateUserRegisterSchema;
//# sourceMappingURL=userRegisterSchema.js.map