"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        groupID: {
            $id: "#/properties/groupID",
            type: "string"
        },
        context: {
            $id: "#/properties/context",
            type: "string"
        },
        action: {
            $id: "#/properties/action",
            type: "string"
        },
        role: {
            $id: "#/properties/role",
            type: "string",
            pattern: "^[a-z0-9_]+$"
        },
        permissions: {
            $id: "#/properties/permissions",
            type: "array",
            items: {
                type: "string"
            },
            nullable: true
        }
    },
    required: [
        "groupID", "context", "action", "role"
    ],
    additionalProperties: true
};
var validateGroupMgmtSchemaRole = ajv.compile(schema);
exports["default"] = validateGroupMgmtSchemaRole;
//# sourceMappingURL=groupMgmtSchemaRole%20copy.js.map