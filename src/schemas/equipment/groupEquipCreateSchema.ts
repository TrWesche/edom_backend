import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupEquipCreateProps {
    name: string
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
        "name", "config"
    ],
    additionalProperties: true
};

const validateGroupEquipCreateSchema = ajv.compile(schema)

export default validateGroupEquipCreateSchema;