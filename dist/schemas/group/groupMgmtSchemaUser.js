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
        usernames: {
            $id: "#/properties/usernames",
            type: "array",
            items: {
                type: "string"
            }
        },
        context: {
            $id: "#/properties/context",
            type: "string"
        },
        action: {
            $id: "#/properties/action",
            type: "string"
        },
        roles: {
            $id: "#/properties/roles",
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    required: [
        "groupID", "usernames", "context", "action"
    ],
    additionalProperties: true
};
var validateGroupMgmtSchemaUser = ajv.compile(schema);
exports["default"] = validateGroupMgmtSchemaUser;
//# sourceMappingURL=groupMgmtSchemaUser.js.map