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
var schema = {
    type: "object",
    properties: {
        password_e1: {
            $id: "#/properties/user_account/properties/password_e1",
            type: "string",
            format: "password",
            "default": "",
            minLength: 8,
            nullable: true
        },
        password_e2: {
            $id: "#/properties/user_account/properties/password_e2",
            type: "string",
            format: "password",
            "default": "",
            minLength: 8,
            nullable: true
        }
    },
    required: [],
    additionalProperties: true
};
var validateUpdatePasswordSchema = ajv.compile(schema);
exports["default"] = validateUpdatePasswordSchema;
//# sourceMappingURL=userUpdatePasswordSchema.js.map