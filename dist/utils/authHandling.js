"use strict";
exports.__esModule = true;
// See user/merchant routes.
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var AuthHandling = /** @class */ (function () {
    function AuthHandling() {
    }
    AuthHandling.generateToken = function (queryRes, queryData) {
        // TODO: This will need to be updated to add user group roles and site / group permissions to the token based on the user request.
        // Will need to look into how to manage the dynamic nature of this better.  Not good practice to be generating new tokens all the time.
        var token = jwt.sign(queryData, config_1.privatekey, { algorithm: 'RS256', expiresIn: '8h' });
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
                token = token.slice(7, token.length).trimLeft();
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