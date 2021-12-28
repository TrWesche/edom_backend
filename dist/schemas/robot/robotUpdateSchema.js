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
    required: [],
    additionalProperties: true
};
var validateUpdateRobotSchema = ajv.compile(schema);
exports["default"] = validateUpdateRobotSchema;
//# sourceMappingURL=robotUpdateSchema.js.map