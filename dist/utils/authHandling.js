"use strict";
exports.__esModule = true;
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var AuthHandling = /** @class */ (function () {
    function AuthHandling() {
    }
    // TODO: This will need to be updated to add user group roles and site / group permissions to the token based on the user request.
    // Will need to look into how to manage the dynamic nature of this better.  Not good practice to be generating new tokens all the time.
    // static generateToken(queryRes, queryData) {
    //     const token = jwt.sign(queryData, privatekey, { algorithm: 'RS256', expiresIn: '8h'});
    //     queryRes.header("auth-token", token);
    // };
    // static validateToken(queryReq) {
    //     try {
    //         let token = queryReq.header("Authorization");
    //         if (!token) {return undefined};
    //         if (token.startsWith('Bearer ')) {
    //             token = token.slice(7, token.length).trimLeft();
    //         }
    //         const verifyToken = jwt.verify(token, privatekey, {algorithms: ['RS256']})
    //         return verifyToken;
    //     } catch (error) {
    //         console.log("Verification Error Occured:", error);
    //     }
    // };
    AuthHandling.generateSessionCookies = function (res, data) {
        var token = jwt.sign(data, config_1.privatekey, { algorithm: 'RS256', expiresIn: '8h' });
        var split_token = token.split(".");
        // console.log(res.cookie);
        // Javascript Enabled Cookie - Full JWT
        // res.cookie("sid", token, {httpOnly: false, maxAge: 86400000, secure: true, sameSite: "None", path: '/', domain: ".twesche.com"});
        res.cookie("sid", token, { httpOnly: false, maxAge: 86400000, secure: true, sameSite: "none", path: '/' });
        // HTTP Only Cookie - JWT Signature Only
        // res.cookie("_sid", split_token[2], {httpOnly: true, maxAge: 86400000, secure: true, sameSite: "None", path: '/', domain: ".twesche.com"});
        res.cookie("_sid", split_token[2], { httpOnly: true, maxAge: 86400000, secure: true, sameSite: "none", path: '/' });
    };
    ;
    AuthHandling.validateSessionCookies = function (req) {
        // console.log("Validating Cookies");
        // console.log(req);
        var privateToken = req.cookies._sid;
        var split_publicToken = req.cookies.sid.split(".");
        // Reconstruct Check Token
        var verificationToken = "".concat(split_publicToken[0], ".").concat(split_publicToken[1], ".").concat(privateToken);
        var verifyResult;
        try {
            verifyResult = jwt.verify(verificationToken, config_1.privatekey, { algorithms: ['RS256'] });
        }
        catch (error) {
            console.log("Verification Error Occured:", error);
        }
        return verifyResult;
    };
    ;
    return AuthHandling;
}());
exports["default"] = AuthHandling;
//# sourceMappingURL=authHandling.js.map