import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupEquipCreateProps {
    name: string
    category_id: string
    headline: string
    description: string
    public: boolean
    config: object
};

const schema: JSONSchemaType<GroupEquipCreateProps> = {
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
        config: {
            $id: "#/properties/config",
            type: "object"
        }
    },
    required: [
        "name", "category_id", "config"
    ],
    additionalProperties: true
};

const validateGroupEquipCreateSchema = ajv.compile(schema)

export default validateGroupEquipCreateSchema;