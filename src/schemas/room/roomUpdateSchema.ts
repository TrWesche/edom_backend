import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RoomUpdateProps {
    name: string
    description: string
    public: boolean
};

const schema: JSONSchemaType<RoomUpdateProps> = {
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

const validateUpdateRoomSchema = ajv.compile(schema)

export default validateUpdateRoomSchema;