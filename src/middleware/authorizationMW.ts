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
        req.sitePermissions = undefined;
        return next();
      };

      const sitePermissions = await SitePermissionsRepo.fetch_permissions_by_user_id(req.user.id);

      req.sitePermissions = sitePermissions;
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };



  /** Middleware: Load User's Permissions for the group into the request. */
  static async loadGroupPermissions(req, res, next) {
    try {
      if (!req.user?.id) {
        req.groupPermissions = undefined;
        return next();
      };

      const groupPermissions = await GroupPermissionsRepo.fetch_permissions_by_user_id(req.user.id);

      req.groupPermissions = groupPermissions;

    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };


  /** Validate Permissions Assigned */
  static validatePermissions(req, res, next) {
    try {
      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      // If no permissions are defined for validating access throw an error
      if (!req.requiredPermissions) {
        return next({ status: 400, message: "Unable to Process Request" });
      };
  
  
      // Check for Group Permissions if they are defined
      if (req.requiredPermissions.group) {
        if (!req.groupPermissions) {
          return next({ status: 401, message: "Unauthorized" });
        }
  
        const permissionsOK = req.requiredPermissions.group.reduce((acc, val) => {
          req.groupPermissions.find(val) && acc;
        }, true)
  
        if (!permissionsOK) {
          return next({ status: 401, message: "Unauthorized" });
        };
      }
  
  
      // Check for Site Permisisons if they are defined
      if (req.requiredPermissions.site) {
        if (!req.sitePermissions) {
          return next({ status: 401, message: "Unauthorized" });
        }
  
        const permissionsOK = req.requiredPermissions.site.reduce((acc, val) => {
          req.sitePermissions.find(val) && acc;
        }, true)
  
        if (!permissionsOK) {
          return next({ status: 401, message: "Unauthorized" });
        };
      }
  
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  }

}




// /** Middleware: Requires user is authenticated. */
// function ensureLoggedIn(req, res, next) {
//   try {
//     if (req.user?.id) {
//       return next();
//     }
//     return next({ status: 401, message: "Unauthorized" });
//   } catch (error) {
//     return next({ status: 401, message: "Unauthorized" });
//   }
// }


// /** Middleware: Requires user type & correct user id. */
// function validateUserID(req, res, next) {
//   try {
//     if (req.user.id === req.params.id && req.user.type === "user") {
//       return next();
//     }

//     return next({ status: 401, message: "Unauthorized" });
//   } catch (err) {
//     return next({ status: 401, message: "Unauthorized" });
//   }
// }




export default authMW;


// export {
//   loadJWT,
//   loadSitePermissions,
//   loadGroupPermissions,
//   ensureLoggedIn,
//   validateUserID,
//   validatePermissions
// };
