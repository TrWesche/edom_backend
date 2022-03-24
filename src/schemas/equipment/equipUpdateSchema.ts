import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface EquipUpdateProps {
    name: string
    category_id: string
    headline: string
    description: string
    image_url: string
    public: boolean
    configuration: object
};

const schema: JSONSchemaType<EquipUpdateProps> = {
    type: "object",
    properties: {
        name: {
            $id:"#/properties/name",
            type: "string",
            default: "",
            minLength: 1,
            pattern: "^[A-z0-9]+$"
        },
        category_id: {
            $id:"#/properties/category_id",
            type: "string"
        },
        headline: {
            $id: "#/properties/headline",
            type: "string",
            maxLength: 255
        },
        description: {
            $id: "#/properties/description",
            type: "string"
        },
        image_url: {
            $id: "#/properties/image_url",
            type: "string"
        },
        public: {
            $id: "#/properties/public",
            type: "boolean",
            default: false
        },
        configuration: {
            $id: "#/properties/configuration",
            type: "object"
        }
    },
    required: [
    ],
    additionalProperties: true
};

const validateEquipUpdateSchema = ajv.compile(schema)

export default validateEquipUpdateSchema;