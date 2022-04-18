/**
 * The UserUpdateSchema provides the ability to update all values associated with a user account.
 */
import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

export interface UserUpdatePasswordProps {
    password_e1: string
    password_e2: string
};

const schema: JSONSchemaType<UserUpdatePasswordProps> = {
    type: "object",
    properties: {
        password_e1: {
            $id: "#/properties/user_account/properties/password_e1",
            type: "string",
            format: "password",
            default: "",
            minLength: 8,
            nullable: true
        },
        password_e2: {
            $id: "#/properties/user_account/properties/password_e2",
            type: "string",
            format: "password",
            default: "",
            minLength: 8,
            nullable: true
        },
    },
    required: [],
    additionalProperties: true
};

const validateUpdatePasswordSchema = ajv.compile(schema)

export default validateUpdatePasswordSchema;