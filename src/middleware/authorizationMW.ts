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

  /** Parse Context and Add Context Sensitive Information to Request */
  static addContextToRequest (req, res, next) {
    try {
        if (req.body.context) {
          switch (req.body.context){
            case "group":
              req.groupID = req.body.ownerid ? req.body.ownerid : "";
              break;
            default:
          };
        };
        return next();
      } catch (err) {
        return next();
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

  static async validateRoutePermissions (req: Request, res: Response, next: NextFunction) {
    // TODO: This should also handle the case where the username is provided for permission determination
    try {
      // console.log("Validating Route Permissions");
      if (!req.user?.id) {
        return next({ status: 401, message: "Unauthorized" });
      };
  
      if (!req.reqPerms) {
        return next({ status: 500, message: "Route Configuration Error - Permissions Definition Missing" });
      };
  
      let permissions: Array<any> = [];

      if (req.params.equipID) {
        // console.log("Checking Equip Permissions");
        const foundPermissions = await PermissionsRepo.fetch_user_equip_permissions(req.user.id, req.params.equipID, req.reqPerms);
        permissions.push(...foundPermissions);
      };

      if (req.params.roomID) {
        // console.log("Checking Room Permissions");
        const foundPermissions = await PermissionsRepo.fetch_user_room_permissions(req.user.id, req.params.roomID, req.reqPerms);
        permissions.push(...foundPermissions);
      };
      
      
      if (req.groupID) {
        // console.log("Checking Group Permissions");
        const foundPermissions = await PermissionsRepo.fetch_user_group_permissions(req.user.id, req.groupID, req.reqPerms);
        permissions.push(...foundPermissions);
      };
      
      
      if (req.params.username) {
        // console.log(req.params.username);
        const comparisonUID = await PermissionsRepo.fetch_user_id_by_username(req.params.username);
        // console.log(comparisonUID);
        if (comparisonUID !== undefined) {
          req.targetUID = comparisonUID.user_id;
          if (req.user.id === req.targetUID) {
            const foundPermissions = await PermissionsRepo.fetch_user_account_permissions_all(req.user.id, req.reqPerms);
            permissions.push(...foundPermissions);
          } 
          // else {
          //   const foundPermissions = await PermissionsRepo.fetch_user_account_permissions_public(req.targetUID ? req.targetUID : "", req.reqPerms);
          //   permissions.push(...foundPermissions);
          // }
        }
      };

      if (
        req.reqPerms.user && 
        req.reqPerms.user.length > 0 && 
        permissions.length <= 0 &&
        !req.params.equipID &&
        !req.params.roomID &&
        !req.params.username &&
        !req.groupID
      ) {
        const foundPermissions = await PermissionsRepo.fetch_user_account_permissions_all(req.user.id, req.reqPerms);
        permissions.push(...foundPermissions);
      } else
      {
        const foundPermissions = await PermissionsRepo.fetch_user_site_permissions_public(req.user.id, req.reqPerms);
        permissions.push(...foundPermissions);
      };

      if (permissions.length === 0) {
        return next({ status: 401, message: "Unauthorized" });
      };

      req.resolvedPerms = permissions;

      return next();
    } catch (error) {
      return next({ status: 401, message: "Error - Unauthorized" });
    }
  };

}

export default authMW;