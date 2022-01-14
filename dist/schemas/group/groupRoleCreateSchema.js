"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        group_id: {
            $id: "#/properties/group_id",
            type: "string"
        },
        name: {
            $id: "#/properties/name",
            type: "string"
        }
    },
    required: [
        "group_id", "name"
    ],
    additionalProperties: true
};
var validateCreateGroupRoleSchema = ajv.compile(schema);
exports["default"] = validateCreateGroupRoleSchema;
//# sourceMappingURL=groupRoleCreateSchema.js.map