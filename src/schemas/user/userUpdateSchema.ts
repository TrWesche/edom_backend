import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

export interface UserUpdateProps {
    username?: string
    email?: string
    password?: string
    first_name?: string
    last_name?: string
};

const schema: JSONSchemaType<UserUpdateProps> = {
    type: "object",
    properties: {
        username: {
            $id:"#/properties/username",
            type: "string",
            default: "",
            minLength: 1,
            nullable: true
        },
        email: {
            $id: "#/properties/email",
            type: "string",
            format: "email",
            default: "",
            minLength: 1,
            nullable: true
        },
        password: {
            $id: "#/properties/password",
            type: "string",
            format: "password",
            default: "",
            minLength: 8,
            nullable: true
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
    required: [],
    additionalProperties: true
};

const validateUserUpdateSchema = ajv.compile(schema)

export default validateUserUpdateSchema;