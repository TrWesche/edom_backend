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