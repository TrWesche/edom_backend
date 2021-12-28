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
        }
    },
    required: [],
    additionalProperties: true
};
var validateUpdateRoomSchema = ajv.compile(schema);
exports["default"] = validateUpdateRoomSchema;
//# sourceMappingURL=roomUpdateSchema.js.map