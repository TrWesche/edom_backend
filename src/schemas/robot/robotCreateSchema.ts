import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RobotCreateProps {
    name: string
    description: string
    config: object
};

const schema: JSONSchemaType<RobotCreateProps> = {
    type: "object",
    properties: {
        name: {
            $id:"#/properties/name",
            type: "string",
            default: "",
            minLength: 1
        },
        description: {
            $id: "#/properties/description",
            type: "string",
            default: ""
        },
        config: {
            $id: "#/properties/config",
            type: "object"
        }
    },
    required: [
        "name", "config"
    ],
    additionalProperties: true
};

const validateCreateRobotSchema = ajv.compile(schema)

export default validateCreateRobotSchema;