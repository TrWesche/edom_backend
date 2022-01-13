import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupUserRoleCreateProps {
    user_id: string
    grouprole_id: string
};

const schema: JSONSchemaType<GroupUserRoleCreateProps> = {
    type: "object",
    properties: {
        user_id: {
            $id:"#/properties/user_id",
            type: "string"
        },
        grouprole_id: {
            $id:"#/properties/grouprole_id",
            type: "string",
        }
    },
    required: [
        "user_id", "grouprole_id"
    ],
    additionalProperties: true
};

const validateCreateGroupUserRoleSchema = ajv.compile(schema)

export default validateCreateGroupUserRoleSchema;