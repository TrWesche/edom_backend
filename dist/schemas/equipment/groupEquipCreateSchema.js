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
        public: {
            $id: "#/properties/public",
            type: "boolean",
            "default": false
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
var validateGroupEquipCreateSchema = ajv.compile(schema);
exports["default"] = validateGroupEquipCreateSchema;
//# sourceMappingURL=groupEquipCreateSchema.js.map