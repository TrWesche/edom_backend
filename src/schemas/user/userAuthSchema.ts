import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["password"]);

export interface UserAuthProps {
    username: string
    password: string
};

const schema: JSONSchemaType<UserAuthProps> = {
    type: "object",
    properties: {
        username: {
            $id:"#/properties/username",
            type: "string",
            default: "",
            minLength: 1
        },
        password: {
            $id: "#/properties/password",
            type: "string",
            format: "password",
            default: "",
            minLength: 8
        }
    },
    required: [
        "username", "password"
    ],
    additionalProperties: true
};

const validateUserAuthSchema = ajv.compile(schema)

export default validateUserAuthSchema;