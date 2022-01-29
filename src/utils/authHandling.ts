// See user/merchant routes.
// Library Imports
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { privatekey } from "../config/config";


class AuthHandling {
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

    static generateSessionCookies(res: Response, data) {
        const token = jwt.sign(data, privatekey, { algorithm: 'RS256', expiresIn: '8h'});
        const split_token = token.split(".");

        console.log(res.cookie);
        // Javascript Enabled Cookie - Full JWT
        // res.cookie("sid", token, {httpOnly: false, maxAge: 86400000, secure: true, sameSite: "None", path: '/', domain: ".twesche.com"});
        res.cookie("sid", token, {httpOnly: false, maxAge: 86400000, secure: true, sameSite: "none", path: '/'});

        // HTTP Only Cookie - JWT Signature Only
        // res.cookie("_sid", split_token[2], {httpOnly: true, maxAge: 86400000, secure: true, sameSite: "None", path: '/', domain: ".twesche.com"});
        res.cookie("_sid", split_token[2], {httpOnly: true, maxAge: 86400000, secure: true, sameSite: "none", path: '/'});
    };

    static validateSessionCookies(req: Request) {
        console.log("Validating Cookies");
        console.log(req);
        const privateToken = req.cookies._sid;
        const split_publicToken = req.cookies.sid.split(".");

        // Reconstruct Check Token
        const verificationToken = `${split_publicToken[0]}.${split_publicToken[1]}.${privateToken}`;

        let verifyResult;
        try {
            verifyResult = jwt.verify(verificationToken, privatekey, {algorithms: ['RS256']}); 
        } catch (error) {
            console.log("Verification Error Occured:", error)
        }

        return verifyResult;
    };
}

export default AuthHandling;