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
        }
    },
    required: [
        "groupID", "usernames"
    ],
    additionalProperties: true
};
var validateCreateGroupUserSchema = ajv.compile(schema);
exports["default"] = validateCreateGroupUserSchema;
//# sourceMappingURL=groupUserCreateSchema.js.map