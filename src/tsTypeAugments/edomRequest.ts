// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript

import { RoutePermissions } from "../repositories/permissions.repository";

// TODO: Need to standardize how IDs are added from the params list to the request object
declare module 'express-serve-static-core' {
    interface Request {
      user?: UserSessionProps
      groupID?: string
      // sitePermissions?: Array<any>
      // groupPermissions?: Array<any>
      requiredPermissions?: Object
      reqPerms?: RoutePermissions
      resolvedPerms?: Array<Object>
      targetUID?: string
      roleID?: string
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