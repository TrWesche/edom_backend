/** Middleware for handling req authorization for routes. */
import AuthHandling from "../utils/authHandling";


/** Middleware: Authenticate user. */
function validateJWT(req, res, next) {
  try {
    const payload = AuthHandling.validateToken(req);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */
function ensureLoggedIn(req, res, next) {
  try {
    if (req.user?.id) {
      return next();
    }
    return next({ status: 401, message: "Unauthorized" });
  } catch (error) {
    return next({ status: 401, message: "Unauthorized" });
  }
}


/** Middleware: Requires user type & correct user id. */
function validateUserID(req, res, next) {
  try {
    if (req.user.id === req.params.id && req.user.type === "user") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}


/** Middleware: Requires user type & correct user id. */
function validatePermissions(req, res, next) {
  try {
    // TODO: This will need to do deeper checks to make sure the user has permissions based on their their
    // individual account, site permissiosn, or group permissions
    if (req.user?.permissions?.role === "user") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}



export {
  validateJWT,
  ensureLoggedIn,
  validateUserID,
  validatePermissions
};
