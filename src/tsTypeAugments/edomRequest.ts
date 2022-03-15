// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript

import { UserObjectProps } from "../repositories/user.repository";

declare module 'express-serve-static-core' {
    interface Request {
      user?: UserSessionProps
      groupID?: string
      // sitePermissions?: Array<any>
      // groupPermissions?: Array<any>
      requiredPermissions?: Object
      reqPerms?: Object
      resolvedPerms?: Array<Object>
      currentuser?: string
    }
    // interface Response {
    //   myField?: string
    // }
}

interface UserSessionProps {
  id?: string,
  session_id?: string,
  site_permissions?: Array<string>,
  group_permissions?: Array<string>,
  premissions?: Array<Object>
};