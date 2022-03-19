"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        context: {
            $id: "$/properties/context",
            type: "string",
            "default": "user"
        },
        ownerid: {
            $id: "$/properties/ownerid",
            type: "string",
            nullable: true
        },
        name: {
            $id: "#/properties/name",
            type: "string",
            "default": "",
            minLength: 1
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
        image_url: {
            $id: "#/properties/image_url",
            type: "string"
        },
        location: {
            $id: "#/properties/location",
            type: "string"
        },
        public: {
            $id: "#/properties/public",
            type: "boolean",
            "default": false
        }
    },
    required: [
        "name"
    ],
    additionalProperties: true
};
var validateCreateGroupSchema = ajv.compile(schema);
exports["default"] = validateCreateGroupSchema;
//# sourceMappingURL=groupCreateSchema.js.map