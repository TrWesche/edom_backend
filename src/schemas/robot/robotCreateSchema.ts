import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RobotCreateProps {
    name: string
    description: string
    public: boolean
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
        public: {
            $id: "#/properties/public",
            type: "boolean",
            default: false
        },
        config: {
            $id: "#/properties/config",
            type: "object"
        }
    },
    required: [
        "name"
    ],
    additionalProperties: true
};

const validateCreateRobotSchema = ajv.compile(schema)

export default validateCreateRobotSchema;