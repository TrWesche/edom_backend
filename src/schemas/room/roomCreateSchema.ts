import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RoomCreateProps {
    name: string
    description: string
    public: boolean
};

const schema: JSONSchemaType<RoomCreateProps> = {
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
        "name"
    ],
    additionalProperties: true
};

const validateCreateRoomSchema = ajv.compile(schema)

export default validateCreateRoomSchema;