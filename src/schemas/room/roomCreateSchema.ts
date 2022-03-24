import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface RoomCreateProps {
    context: string
    ownerid: string
    name: string
    category_id: string
    headline: string
    description: string
    image_url: string
    public: boolean
};

const schema: JSONSchemaType<RoomCreateProps> = {
    type: "object",
    properties: {
        context: {
            $id: "$/properties/context",
            type: "string",
            default: "user"
        },
        ownerid: {
            $id: "$/properties/ownerid",
            type: "string",
            nullable: true
        },
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
        "name", "category_id"
    ],
    additionalProperties: true
};

const validateRoomCreateSchema = ajv.compile(schema)

export default validateRoomCreateSchema;