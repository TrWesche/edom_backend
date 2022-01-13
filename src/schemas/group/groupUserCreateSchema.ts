import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupUserCreateProps {
    groupID: string
    userID: string
};

const schema: JSONSchemaType<GroupUserCreateProps> = {
    type: "object",
    properties: {
        groupID: {
            $id:"#/properties/groupID",
            type: "string"
        },
        userID: {
            $id:"#/properties/userID",
            type: "string",
        }
    },
    required: [
        "groupID", "userID"
    ],
    additionalProperties: true
};

const validateCreateGroupUserSchema = ajv.compile(schema)

export default validateCreateGroupUserSchema;