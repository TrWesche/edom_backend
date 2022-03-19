"use strict";
exports.__esModule = true;
// Library Imports
var express = require("express");
var userGroupRouter = express.Router();
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
// userGroupRouter.get("/", authMW.defineSitePermissions(["read_group_self"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.user?.id) {
//             throw new ExpressError("Invalid Call: Get User Groups - All", 401);
//         };
//         // Processing
//         const queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.user?.id, 10, 0);
//         if (!queryData) {
//             throw new ExpressError("Groups Not Found: Get User Groups - All", 404);
//         };
//         return res.json({group: queryData});
//     } catch (error) {
//         next(error)
//     }
// });
// export default userGroupRouter;
//# sourceMappingURL=userGroupRouter.js.map