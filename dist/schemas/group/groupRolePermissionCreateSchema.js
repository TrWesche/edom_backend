"use strict";
exports.__esModule = true;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
;
var schema = {
    type: "object",
    properties: {
        grouprole_id: {
            $id: "#/properties/grouprole_id",
            type: "string"
        },
        grouppermission_id: {
            $id: "#/properties/grouppermission_id",
            type: "string"
        }
    },
    required: [
        "grouprole_id", "grouppermission_id"
    ],
    additionalProperties: true
};
var validateCreateGroupRolePermissionSchema = ajv.compile(schema);
exports["default"] = validateCreateGroupRolePermissionSchema;
//# sourceMappingURL=groupRolePermissionCreateSchema.js.map