import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

export interface UserRegisterProps {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
};

const schema: JSONSchemaType<UserRegisterProps> = {
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
        },
        first_name: {
            $id:"#/properties/first_name",
            type: "string",
            nullable: true
        },
        last_name: {
            $id:"#/properties/last_name",
            type: "string",
            nullable: true
        }
    },
    required: [
        "username", "email", "password"
    ],
    additionalProperties: true
};

const validateUserRegisterSchema = ajv.compile(schema)

export default validateUserRegisterSchema;