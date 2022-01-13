import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface UserRoomUpdateProps {
    name: string
    category_id: string
    headline: string
    description: string
    public: boolean
};

const schema: JSONSchemaType<UserRoomUpdateProps> = {
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
            $id:"#/properties/headline",
            type: "string"
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

const validateUserRoomUpdateSchema = ajv.compile(schema)

export default validateUserRoomUpdateSchema;