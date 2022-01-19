import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupEquipUpdateProps {
    name: string
    category_id: string
    headline: string
    description: string
    public: boolean
    configuration: object
};

const schema: JSONSchemaType<GroupEquipUpdateProps> = {
    type: "object",
    properties: {
        name: {
            $id:"#/properties/name",
            type: "string",
            default: "",
            minLength: 1
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

const validateGroupEquipUpdateSchema = ajv.compile(schema)

export default validateGroupEquipUpdateSchema;