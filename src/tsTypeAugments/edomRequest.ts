// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript

import { UserObjectProps } from "../repositories/user.repository";

declare module 'express-serve-static-core' {
    interface Request {
      user?: UserObjectProps
    }
    // interface Response {
    //   myField?: string
    // }
}