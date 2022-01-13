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
            type: "string"
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
        }
    },
    required: [
        "name", "category_id"
    ],
    additionalProperties: true
};
var validateUserRoomCreateSchema = ajv.compile(schema);
exports["default"] = validateUserRoomCreateSchema;
//# sourceMappingURL=userRoomCreateSchema.js.map