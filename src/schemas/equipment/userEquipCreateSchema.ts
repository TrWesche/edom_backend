import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface UserEquipCreateProps {
    name: string
    category_id: string
    headline: string
    description: string
    public: boolean
    config: object
};

const schema: JSONSchemaType<UserEquipCreateProps> = {
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

const validateUserEquipCreateSchema = ajv.compile(schema)

export default validateUserEquipCreateSchema;