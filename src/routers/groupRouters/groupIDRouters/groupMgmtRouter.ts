import * as express from "express";

// Utility Functions Import
// import ExpressError from "../../../utils/expresError";

// Schema Imports

// Model Imports
// import GroupModel from "../../../models/groupModel";

// Middleware Imports
// import authMW from "../../../middleware/authorizationMW";

// Router Imports
import groupMgmtRouterUser from "./groupMgmtRouterUser";
import groupMgmtRouterRole from "./groupMgmtRouterRole";
import groupMgmtRouterPerm from "./groupMgmtRouterPerm";
import groupMgmtRouterRequest from "./groupMgmtRouterRequest";


const groupMgmtRouter = express.Router();


groupMgmtRouter.use("/user", groupMgmtRouterUser)
groupMgmtRouter.use("/role", groupMgmtRouterRole)
groupMgmtRouter.use("/perm", groupMgmtRouterPerm)
groupMgmtRouter.use("/req", groupMgmtRouterRequest)


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/



export default groupMgmtRouter;