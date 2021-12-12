import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

export interface UserUpdateProps {
    username: string
    email: string
    password: string
};

const schema: JSONSchemaType<UserUpdateProps> = {
    type: "object",
    properties: {
        username: {
            $id:"#/properties/username",
            type: "string",
            default: "",
            minLength: 1
        },
        email: {
            $id: "#/properties/email",
            type: "string",
            format: "email",
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
    required: [],
    additionalProperties: true
};

const validateUserUpdateSchema = ajv.compile(schema)

export default validateUserUpdateSchema;