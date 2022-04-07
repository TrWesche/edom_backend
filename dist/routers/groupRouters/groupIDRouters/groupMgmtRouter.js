"use strict";
exports.__esModule = true;
var express = require("express");
// Router Imports
var groupMgmtRouterUser_1 = require("./groupMgmtRouterUser");
var groupMgmtRouterRole_1 = require("./groupMgmtRouterRole");
var groupMgmtRouterPerm_1 = require("./groupMgmtRouterPerm");
var groupMgmtRouterRequest_1 = require("./groupMgmtRouterRequest");
var groupMgmtRouter = express.Router();
groupMgmtRouter.use("/user", groupMgmtRouterUser_1["default"]);
groupMgmtRouter.use("/role", groupMgmtRouterRole_1["default"]);
groupMgmtRouter.use("/perm", groupMgmtRouterPerm_1["default"]);
groupMgmtRouter.use("/req", groupMgmtRouterRequest_1["default"]);
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
exports["default"] = groupMgmtRouter;
//# sourceMappingURL=groupMgmtRouter.js.map