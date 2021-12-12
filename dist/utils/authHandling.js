"use strict";
exports.__esModule = true;
// See user/merchant routes.
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config/config");
var AuthHandling = /** @class */ (function () {
    function AuthHandling() {
    }
    AuthHandling.generateToken = function (queryRes, queryData) {
        var token = jsonwebtoken_1["default"].sign(queryData, config_1.private_key, { algorithm: 'RS256' });
        queryRes.header("auth-token", token);
    };
    AuthHandling.validateToken = function (queryReq) {
        try {
            var token = queryReq.header("Authorization");
            if (!token) {
                throw new Error("Access Denied");
            }
            ;
            if (token.startsWith('Bearer ')) {
                token.slice(7, token.length).trimLeft();
            }
            var verifyToken = jsonwebtoken_1["default"].verify(token, config_1.private_key, { algorithms: ['RS256'] });
            return verifyToken;
        }
        catch (error) {
            console.log("Verification Error Occured:", error);
        }
    };
    return AuthHandling;
}());
exports["default"] = AuthHandling;
//# sourceMappingURL=authHandling.js.map