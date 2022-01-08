import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupEquipUpdateProps {
    name: string
    description: string
    public: boolean
    config: object
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

const validateGroupEquipUpdateSchema = ajv.compile(schema)

export default validateGroupEquipUpdateSchema;