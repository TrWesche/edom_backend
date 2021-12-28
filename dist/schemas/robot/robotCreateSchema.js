"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        name: {
            $id: "#/properties/name",
            type: "string",
            "default": "",
            minLength: 1
        },
        description: {
            $id: "#/properties/description",
            type: "string",
            "default": ""
        },
        config: {
            $id: "#/properties/config",
            type: "object"
        }
    },
    required: [
        "name", "config"
    ],
    additionalProperties: true
};
var validateCreateRobotSchema = ajv.compile(schema);
exports["default"] = validateCreateRobotSchema;
//# sourceMappingURL=robotCreateSchema.js.map