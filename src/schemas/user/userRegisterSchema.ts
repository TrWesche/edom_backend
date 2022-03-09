import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

export interface UserRegisterProps {
    user_account: UserAccountProps,
    user_profile: UserProfileProps,
    user_data: UserDataProps
};

interface UserAccountProps {
    password: string
};

interface UserProfileProps {
    username: string,
    headline?: string,
    about?: string,
    image_url?: string,
    public?: boolean
};

interface UserDataProps {
    email: string,
    public_email?: boolean,
    first_name?: string,
    public_first_name?: boolean,
    last_name?: string,
    public_last_name?: boolean,
    location?: string,
    public_location?: boolean
};

const schema: JSONSchemaType<UserRegisterProps> = {
    type: "object",
    properties: {
        user_account: {
            $id: "#/properties/user_account",
            type: "object",
            properties: {
                password: {
                    $id: "#/properties/user_account/properties/password",
                    type: "string",
                    format: "password",
                    default: "",
                    minLength: 8
                },
            },
            required: ["password"]
        },
        user_profile: {
            $id: "#/properties/user_profile",
            type: "object",
            properties: {
                username: {
                    $id:"#/properties/user_profile/properties/username",
                    type: "string",
                    default: "",
                    minLength: 4
                },
                headline: {
                    $id:"#/properties/user_profile/properties/headline",
                    type: "string",
                    nullable: true
                },
                about: {
                    $id:"#/properties/user_profile/properties/about",
                    type: "string",
                    nullable: true
                },
                image_url: {
                    $id:"#/properties/user_profile/properties/image_url",
                    type: "string",
                    nullable: true
                },
                public: {
                    $id:"#/properties/user_profile/properties/public",
                    type: "boolean",
                    default: false,
                    nullable: true
                }
            },
            required: ["username"]
        },
        user_data: {
            $id: "#/properties/user_data",
            type: "object",
            properties: {
                email: {
                    $id:"#/properties/user_data/properties/username",
                    type: "string",
                    format: "email",
                    default: "",
                    minLength: 6
                },
                public_email: {
                    $id:"#/properties/user_data/properties/public_email",
                    type: "boolean",
                    default: false,
                    nullable: true
                },
                first_name: {
                    $id:"#/properties/user_data/properties/first_name",
                    type: "string",
                    nullable: true
                },
                public_first_name: {
                    $id:"#/properties/user_data/properties/public_first_name",
                    type: "boolean",
                    default: true,
                    nullable: true
                },
                last_name: {
                    $id:"#/properties/user_data/properties/last_name",
                    type: "string",
                    nullable: true
                },
                public_last_name: {
                    $id:"#/properties/user_data/properties/public_last_name",
                    type: "boolean",
                    default: false,
                    nullable: true
                },
                location: {
                    $id:"#/properties/user_data/properties/location",
                    type: "string",
                    nullable: true
                },
                public_location: {
                    $id:"#/properties/user_data/properties/public_location",
                    type: "boolean",
                    default: false,
                    nullable: true
                }
            },
            required: ["email"]
        }
    },
    required: [
        "user_account", "user_data", "user_profile"
    ],
    additionalProperties: true
};



// export interface UserRegisterProps {
//     username: string
//     email: string
//     password: string
//     first_name?: string
//     last_name?: string
// };

// const schema: JSONSchemaType<UserRegisterProps> = {
//     type: "object",
//     properties: {
//         username: {
//             $id:"#/properties/username",
//             type: "string",
//             default: "",
//             minLength: 1
//         },
//         email: {
//             $id: "#/properties/email",
//             type: "string",
//             format: "email",
//             default: "",
//             minLength: 1
//         },
//         password: {
//             $id: "#/properties/password",
//             type: "string",
//             format: "password",
//             default: "",
//             minLength: 8
//         },
//         first_name: {
//             $id:"#/properties/first_name",
//             type: "string",
//             nullable: true
//         },
//         last_name: {
//             $id:"#/properties/last_name",
//             type: "string",
//             nullable: true
//         }
//     },
//     required: [
//         "username", "email", "password"
//     ],
//     additionalProperties: true
// };

const validateUserRegisterSchema = ajv.compile(schema)

export default validateUserRegisterSchema;