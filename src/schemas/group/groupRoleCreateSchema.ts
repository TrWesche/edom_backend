import Ajv, {JSONSchemaType} from "ajv";

const ajv = new Ajv();

export interface GroupRoleCreateProps {
    group_id: string
    name: string
};

const schema: JSONSchemaType<GroupRoleCreateProps> = {
    type: "object",
    properties: {
        group_id: {
            $id:"#/properties/group_id",
            type: "string"
        },
        name: {
            $id:"#/properties/name",
            type: "string",
            pattern: "^[A-z0-9]+$"
        }
    },
    required: [
        "group_id", "name"
    ],
    additionalProperties: true
};

const validateCreateGroupRoleSchema = ajv.compile(schema)

export default validateCreateGroupRoleSchema;