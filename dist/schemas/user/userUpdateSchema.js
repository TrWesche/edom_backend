"use strict";
exports.__esModule = true;
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
            minLength: 1,
            nullable: true
        },
        email: {
            $id: "#/properties/email",
            type: "string",
            format: "email",
            "default": "",
            minLength: 1,
            nullable: true
        },
        password: {
            $id: "#/properties/password",
            type: "string",
            format: "password",
            "default": "",
            minLength: 8,
            nullable: true
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
    required: [],
    additionalProperties: true
};
var validateUserUpdateSchema = ajv.compile(schema);
exports["default"] = validateUserUpdateSchema;
//# sourceMappingURL=userUpdateSchema.js.map