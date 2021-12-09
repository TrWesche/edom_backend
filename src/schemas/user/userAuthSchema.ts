import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv()

interface UserAuthProps {
  email: string
  password: string
}

const schema: JSONSchemaType<UserAuthProps> = {
    type: "object",
    properties: {
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
        "email", "password"
    ],
    additionalProperties: true
};

const validateUserAuthSchema = ajv.compile(schema)

export default validateUserAuthSchema;