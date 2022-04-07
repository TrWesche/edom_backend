import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupMgmtSchemaUser {
    groupID: string
    usernames: Array<string>
    context: string
    action: string
    roles: Array<string>
};

const schema: JSONSchemaType<GroupMgmtSchemaUser> = {
    type: "object",
    properties: {
        groupID: {
            $id:"#/properties/groupID",
            type: "string"
        },
        usernames: {
            $id:"#/properties/usernames",
            type: "array",
            items: {
                type: "string"
            }
        },
        context: {
            $id:"#/properties/context",
            type: "string"
        },
        action: {
            $id:"#/properties/action",
            type: "string"
        },
        roles: {
            $id:"#/properties/roles",
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

const validateGroupMgmtSchemaUser = ajv.compile(schema)

export default validateGroupMgmtSchemaUser;