"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        user_id: {
            $id: "#/properties/user_id",
            type: "string"
        },
        grouprole_id: {
            $id: "#/properties/grouprole_id",
            type: "string"
        }
    },
    required: [
        "user_id", "grouprole_id"
    ],
    additionalProperties: true
};
var validateCreateGroupUserRoleSchema = ajv.compile(schema);
exports["default"] = validateCreateGroupUserRoleSchema;
//# sourceMappingURL=groupUserRoleCreateSchema.js.map