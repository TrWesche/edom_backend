import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupUpdateProps {
    name: string
    description: string
    public: boolean
};

const schema: JSONSchemaType<GroupUpdateProps> = {
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
        }
    },
    required: [
    ],
    additionalProperties: true
};

const validateUpdateGroupSchema = ajv.compile(schema)

export default validateUpdateGroupSchema;