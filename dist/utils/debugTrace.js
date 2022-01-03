"use strict";
exports.__esModule = true;
var config_1 = require("../config/config");
function debugTrace(fname, step, msg, localEnable) {
    if (localEnable === void 0) { localEnable = true; }
    if (config_1.enableDebugTrace && localEnable) {
        console.log("\n            Function: ".concat(fname, "\n            Step: ").concat(step, "\n            Message: ").concat(msg, "\n            "));
    }
}
exports["default"] = debugTrace;
//# sourceMappingURL=debugTrace.js.map