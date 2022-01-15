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
        category_id: {
            $id: "#/properties/category_id",
            type: "string"
        },
        headline: {
            $id: "#/properties/headline",
            type: "string",
            maxLength: 255
        },
        description: {
            $id: "#/properties/description",
            type: "string"
        },
        public: {
            $id: "#/properties/public",
            type: "boolean",
            "default": false
        },
        configuration: {
            $id: "#/properties/configuration",
            type: "object"
        }
    },
    required: [],
    additionalProperties: true
};
var validateUserEquipUpdateSchema = ajv.compile(schema);
exports["default"] = validateUserEquipUpdateSchema;
//# sourceMappingURL=userEquipUpdateSchema.js.map