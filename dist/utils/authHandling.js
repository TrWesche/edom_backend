"use strict";
exports.__esModule = true;
// See user/merchant routes.
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var AuthHandling = /** @class */ (function () {
    function AuthHandling() {
    }
    AuthHandling.generateToken = function (queryRes, queryData) {
        var token = jwt.sign(queryData, config_1.privatekey, { algorithm: 'RS256' });
        queryRes.header("auth-token", token);
    };
    AuthHandling.validateToken = function (queryReq) {
        try {
            var token = queryReq.header("Authorization");
            if (!token) {
                return undefined;
            }
            ;
            if (token.startsWith('Bearer ')) {
                token.slice(7, token.length).trimLeft();
            }
            var verifyToken = jwt.verify(token, config_1.privatekey, { algorithms: ['RS256'] });
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