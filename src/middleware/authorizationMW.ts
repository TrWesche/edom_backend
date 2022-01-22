/** Middleware for handling req authorization for routes. */
import AuthHandling from "../utils/authHandling";

import GroupPermissionsRepo from "../repositories/groupPermissions.repository";
import SitePermissionsRepo from "../repositories/sitePermissions.repository";

class authMW {

  /** Middleware: Load JWT Data Into Request & Authenticate user. */
  static loadJWT(req, res, next) {
    try {
      const payload = AuthHandling.validateToken(req);
      req.user = payload; // create a current user
      return next();
    } catch (err) {
      return next();
    }
  };

  /** Middleware: Load User's Permissions for the site into the request. */
  static async loadSitePermissions(req, res, next) {
    try {
      if (!req.user?.id) {
        return next();
      };

      const sitePermissions = await SitePermissionsRepo.fetch_permissions_by_user_id(req.user.id);

      req.user.site_permissions = sitePermissions;
      return next();
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };

  /** Middleware: Load User's Permissions for the group into the request. */
  static async loadGroupPermissions(req, res, next) {
    try {
      // console.log("Loading Group Permissions");
      if (!req.user?.id || !req.groupID) {
        req.user.group_permissions = undefined;
        return next();
      };

      const groupPermissions = await GroupPermissionsRepo.fetch_user_group_permissions_by_user_id(req.user.id, req.groupID);
      req.user.group_permissions = groupPermissions;

      // console.log(req.user);
      return next();
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };

  /** Middleware: Validate Permissions Assigned - Comparing User's Assigned Site/Group Permissions to those Required for the endpoint */
  static validatePermissions(req, res, next) {
    // console.log(req.user.group_permissions);
    // console.log(req.requiredPermissions.group);
    try {

      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      // If no permissions are defined for validating access throw an error
      if (!req.requiredPermissions.site) {
        return next({ status: 500, message: "Route Configuration Error - SP Def Missing" });
      };
  
      // Check for Group Permissions if they are defined
      if (req.requiredPermissions.group) {
        if (!req.user.group_permissions) {
          return next({ status: 500, message: "Route Configuration Error - GP Def Missing" });
        }
  
        const permissionsOK = req.requiredPermissions.group.reduce((acc, val) => {
          const findResult = req.user.group_permissions.find(perm => {
            return perm.permission_name === val;
          });

          return findResult !== undefined && acc;
        }, true);
  
        if (!permissionsOK) {
          return next({ status: 401, message: "Unauthorized" });
        };
      }
  
      // Check for Site Permisisons if they are defined
      if (req.requiredPermissions.site) {
        if (!req.user.site_permissions) {
          return next({ status: 401, message: "Unauthorized" });
        }

        const permissionsOK = req.requiredPermissions.site.reduce((acc, val) => {
          const findResult = req.user.site_permissions.find(perm => {
            return perm.permission_name === val;
          });

          return findResult !== undefined && acc;
        }, true);
  
        if (!permissionsOK) {
          return next({ status: 401, message: "Unauthorized" });
        };

        return next();
      }
  
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };

  /** Define Permissions Required to Access a Site Endpoint */
  static defineSitePermissions (permList: Array<string>) {
    return (req, res, next) => {
        try {
            if (req.requiredPermissions) {
                req.requiredPermissions.site = permList;
            } else {
                req.requiredPermissions = {
                    site: permList
                };
            }
            return next();
          } catch (err) {
            return next();
          }
    }
  };

  /** Move the GroupID from the Route Parameters into the Request Object */
  static addGroupIDToRequest (req, res, next) {
    try {
        if (req.params.groupID) {
            req.groupID = req.params.groupID;
        } else {
            req.groupID = undefined;
        }
        return next();
      } catch (err) {
        return next();
      }
  };

  /** Define Permissions Required to Access a Group Endpoint */
  static defineGroupPermissions (permList: Array<string>) {
    return (req, res, next) => {
        
        try {
            if (req.requiredPermissions) {
                req.requiredPermissions.group = permList;
            } else {
                req.requiredPermissions = {
                    group: permList
                };
            }
            return next();
          } catch (err) {
            return next();
          }
    }
  };

}

export default authMW;