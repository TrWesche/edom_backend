// See user/merchant routes.
import jwt from "jsonwebtoken";
import { private_key } from "../config/config";


class AuthHandling {
    static generateCookies(queryRes, queryData) {
        const token = jwt.sign(queryData, private_key, { algorithm: 'RS256'});

        queryRes.header("auth-token", token);
    }

    static validateCookies(queryReq) {
        try {
            let token = queryReq.header("Authorization");

            if (!token) {throw new Error("Access Denied")};

            if (token.startsWith('Bearer ')) {
                token.slice(7, token.length).trimLeft();
            }

            const verifyToken = jwt.verify(token, private_key, {algorithms: ['RS256']})
            return verifyToken;
        } catch (error) {
            console.log("Verification Error Occured:", error);
        }
    }
}

export default AuthHandling;