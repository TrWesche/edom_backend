import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupMgmtSchemaPerm {
    groupID: string
    context: string
    action: string
    role: string
    permissions: Array<string>
};

const schema: JSONSchemaType<GroupMgmtSchemaPerm> = {
    type: "object",
    properties: {
        groupID: {
            $id:"#/properties/groupID",
            type: "string"
        },
        context: {
            $id:"#/properties/context",
            type: "string"
        },
        action: {
            $id:"#/properties/action",
            type: "string"
        },
        role: {
            $id:"#/properties/role",
            type: "string",
            pattern: "^[a-z0-9_]+$"
        },
        permissions: {
            $id:"#/properties/permissions",
            type: "array",
            items: {
                type: "string",
                pattern: "^[a-z0-9_]+$"
            }
        }
    },
    required: [
        "groupID", "context", "action", "role", "permissions"
    ],
    additionalProperties: true
};

const validateGroupMgmtSchemaPerm = ajv.compile(schema)

export default validateGroupMgmtSchemaPerm;