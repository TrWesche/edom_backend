import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RoomUpdateProps {
    name: string
    category_id: string
    headline: string
    description: string
    image_url: string
    public: boolean
};

const schema: JSONSchemaType<RoomUpdateProps> = {
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
            $id:"#/properties/headline",
            type: "string",
            maxLength: 255
        },
        description: {
            $id: "#/properties/description",
            type: "string",
            default: ""
        },
        image_url: {
            $id: "#/properties/image_url",
            type: "string"
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

const validateRoomUpdateSchema = ajv.compile(schema)

export default validateRoomUpdateSchema;