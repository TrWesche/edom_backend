import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupCreateProps {
    name: string
    headline: string
    description: string
    public: boolean
};

const schema: JSONSchemaType<GroupCreateProps> = {
    type: "object",
    properties: {
        name: {
            $id:"#/properties/name",
            type: "string",
            default: "",
            minLength: 1
        },
        headline: {
            $id:"#/properties/headline",
            type: "string",
            maxLength: 255
        },
        description: {
            $id: "#/properties/description",
            type: "string"
        },
        public: {
            $id: "#/properties/public",
            type: "boolean",
            default: false
        }
    },
    required: [
        "name"
    ],
    additionalProperties: true
};

const validateCreateGroupSchema = ajv.compile(schema)

export default validateCreateGroupSchema;