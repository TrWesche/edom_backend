import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupUserCreateProps {
    groupID: string
    usernames: Array<string>
};

const schema: JSONSchemaType<GroupUserCreateProps> = {
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
        }
    },
    required: [
        "groupID", "usernames"
    ],
    additionalProperties: true
};

const validateCreateGroupUserSchema = ajv.compile(schema)

export default validateCreateGroupUserSchema;