// Library Imports
import { NextFunction, Request, Response } from "express";

/** Middleware for handling req authorization for routes. */
import AuthHandling from "../utils/authHandling";

import GroupPermissionsRepo from "../repositories/groupPermissions.repository";
import SitePermissionsRepo from "../repositories/sitePermissions.repository";
import PermissionsRepo, { RoutePermissions } from "../repositories/permissions.repository";

class authMW {

  /** Middleware: Load JWT Data Into Request & Authenticate user. */
  static loadJWT(req: Request, res: Response, next: NextFunction) {
    try {
      // const payload = AuthHandling.validateToken(req);
      const payload = AuthHandling.validateSessionCookies(req);
      req.user = payload; // create a current user
      return next();
    } catch (err) {
      return next();
    }
  };

  /** Middleware: Load User's Permissions for the site into the request. */
  static async loadSitePermissions(req: Request, res: Response, next: NextFunction) {
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
  static async loadGroupPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id || !req.groupID) {
        if (!req.user) {
          req.user = undefined;
        } else {
          req.user.group_permissions = undefined;
        }
        return next();
      };

      const groupPermissions = await GroupPermissionsRepo.fetch_user_group_permissions_by_user_id(req.user.id, req.groupID);
      req.user.group_permissions = groupPermissions;

      return next();
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };

  /** Middleware: Load All User Permissions. */
  // Version 1 of this, need to think about how to make it faster
  static async loadUserPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.id) {
        req.user = undefined;
        return next();
      };

      const userPermissions = await PermissionsRepo.fetch_permissions_by_user_id(req.user.id);
      req.user.premissions = userPermissions;

      console.log(req.user.premissions);

      return next();
    } catch (error) {
      return next({ status: 401, message: "Unauthorized" });
    }
  };


  /** Middleware: Validate Permissions Assigned - Comparing User's Assigned Site/Group Permissions to those Required for the endpoint */
  static validatePermissions(req, res, next) {
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
  

  /** Define Permissions Required to Access a Site Endpoint */
  static defineRoutePermissions (permissions: RoutePermissions) {
    return (req, res, next) => {
        try {
            req.reqPerms = permissions;

            return next();
          } catch (err) {
            return next();
          }
    }
  };

  static async validateRoutePermissions (req, res, next) {
    try {
      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      if (!req.reqPerms) {
        return next({ status: 500, message: "Route Configuration Error - Permissions Definition Missing" });
      };
  
      let permissions;
  
      if (req.params.equipID) {
        permissions = await PermissionsRepo.fetch_user_equip_permissions(req.user.id, req.params.equipID, req.reqPerms);
      } else 
      if (req.params.roomID) {
        permissions = await PermissionsRepo.fetch_room_permissions_group(req.user.id, req.params.roomID, req.requiredPermissions.group);
      } else 
      if (req.params.groupID) {
        permissions = await PermissionsRepo.fetch_group_permissions(req.user.id, req.params.groupID, req.requiredPermissions.group);
      };
      
      console.log("Validate Permissions Group");
      console.log(permissions);
      // TODO: The return from this check could be useful in limiting the data returned by the query.
      if (permissions.length === 0) {
        console.log("Permissions Failure - Group");
        return next({ status: 401, message: "Unauthorized" });
      };
  
      return next();
    } catch (error) {
      return next({ status: 401, message: "Error - Unauthorized" });
    }
  };


  static async validatePermissionsGroup(req, res, next) {
    try {
      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      if (!req.requiredPermissions.site) {
        return next({ status: 500, message: "Route Configuration Error - SP Def Missing" });
      };
  
      let permissions;
  
      if (req.params.equipID) {
        permissions = await PermissionsRepo.fetch_equip_permissions_group(req.user.id, req.params.equipID, req.requiredPermissions.group);
      } else if (req.params.roomID) {
        permissions = await PermissionsRepo.fetch_room_permissions_group(req.user.id, req.params.roomID, req.requiredPermissions.group);
      } else if (req.params.groupID) {
        permissions = await PermissionsRepo.fetch_group_permissions(req.user.id, req.params.groupID, req.requiredPermissions.group);
      };
      
      console.log("Validate Permissions Group");
      console.log(permissions);
      // TODO: The return from this check could be useful in limiting the data returned by the query.
      if (permissions.length === 0) {
        console.log("Permissions Failure - Group");
        return next({ status: 401, message: "Unauthorized" });
      };
  
      return next();
    } catch (error) {
      return next({ status: 401, message: "Error - Unauthorized" });
    }
  };

  static async validatePermissionsSite(req, res, next) {
    try {
      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      if (!req.requiredPermissions.site) {
        return next({ status: 500, message: "Route Configuration Error - SP Def Missing" });
      };
  
      let permissions;
  
      if (req.params.equipID) {
        permissions = await PermissionsRepo.fetch_equip_permissions_user(req.user.id, req.params.equipID, req.requiredPermissions.site);
      } else if (req.params.roomID) {
        permissions = await PermissionsRepo.fetch_room_permissions_user(req.user.id, req.params.roomID, req.requiredPermissions.site);
      } else {
        permissions = await PermissionsRepo.fetch_site_permissions(req.user.id, req.requiredPermissions.site);
      };
      
      console.log("Validate Permissions Site");
      console.log(permissions);
      // TODO: The return from this check could be useful in limiting the data returned by the query.
      // TODO: Perhaps a good strategy would be to use the permissions list to determine all applicable permissions and return them for use in the route
      if (permissions.length === 0) {
        console.log("Permissions Failure - Site");
        return next({ status: 401, message: "Unauthorized" });
      };
  
      return next();
    } catch (error) {
      return next({ status: 401, message: "Error - Unauthorized" });
    }
  };

}

export default authMW;