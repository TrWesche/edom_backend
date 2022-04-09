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
        permission: {
            $id: "#/properties/permission",
            type: "array",
            items: {
                type: "string",
                pattern: "^[a-z0-9_]+$"
            }
        }
    },
    required: [
        "groupID", "context", "action", "role", "permission"
    ],
    additionalProperties: true
};
var validateGroupMgmtSchemaPerm = ajv.compile(schema);
exports["default"] = validateGroupMgmtSchemaPerm;
//# sourceMappingURL=groupMgmtSchemaPerm.js.map