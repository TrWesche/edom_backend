import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupCreateProps {
    context: string
    ownerid: string
    name: string
    headline: string
    description: string
    image_url: string
    location: string
    public: boolean
};

const schema: JSONSchemaType<GroupCreateProps> = {
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
            minLength: 1
        },
        headline: {
            $id:"#/properties/headline",
            type: "string",
            maxLength: 255
        },
        description: {
            $id: "#/properties/description",
            type: "string"
        },
        image_url: {
            $id: "#/properties/image_url",
            type: "string"
        },
        location: {
            $id: "#/properties/location",
            type: "string"
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

const validateCreateGroupSchema = ajv.compile(schema)

export default validateCreateGroupSchema;