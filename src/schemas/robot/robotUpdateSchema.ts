import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RobotUpdateProps {
    name: string
    description: string
    public: boolean
    config: object
};

const schema: JSONSchemaType<RobotUpdateProps> = {
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
    ],
    additionalProperties: true
};

const validateUpdateRobotSchema = ajv.compile(schema)

export default validateUpdateRobotSchema;