"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var ajv = new ajv_1["default"]();
(0, ajv_formats_1["default"])(ajv, ["password"]);
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
        password: {
            $id: "#/properties/password",
            type: "string",
            format: "password",
            "default": "",
            minLength: 8
        }
    },
    required: [
        "username", "password"
    ],
    additionalProperties: true
};
var validateUserAuthSchema = ajv.compile(schema);
exports["default"] = validateUserAuthSchema;
//# sourceMappingURL=userAuthSchema.js.map