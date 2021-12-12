"use strict";
/** ExpressError extends the normal JS error so we can easily
 *  add a status when we make an instance of it.
 *
 *  Since we are using JSONSchema and will return an array of
 *  errors we want to make sure we display that properly
 *  The error-handling middleware will return this.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ExpressError = /** @class */ (function (_super) {
    __extends(ExpressError, _super);
    function ExpressError(message, status) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.status = status;
        return _this;
        // console.error(this.stack);
    }
    return ExpressError;
}(Error));
exports["default"] = ExpressError;
//# sourceMappingURL=expresError.js.map