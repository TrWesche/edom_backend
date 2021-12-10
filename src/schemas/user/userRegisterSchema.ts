import Ajv, {JSONSchemaType} from "ajv";
const ajv = new Ajv();

export interface UserRegisterProps {
    username: string
    email: string
    password: string
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
            default: "",
            minLength: 8
        }
    },
    required: [
        "username", "email", "password"
    ],
    additionalProperties: true
};

const validateUserRegisterSchema = ajv.compile(schema)

export default validateUserRegisterSchema;