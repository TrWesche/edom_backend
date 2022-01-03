// See user/merchant routes.
import * as jwt from "jsonwebtoken";
import { privatekey } from "../config/config";


class AuthHandling {
    static generateToken(queryRes, queryData) {
        const token = jwt.sign(queryData, privatekey, { algorithm: 'RS256'});

        queryRes.header("auth-token", token);
    }

    static validateToken(queryReq) {
        try {
            let token = queryReq.header("Authorization");

            if (!token) {return undefined};

            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft();
            }

            const verifyToken = jwt.verify(token, privatekey, {algorithms: ['RS256']})
            return verifyToken;
        } catch (error) {
            console.log("Verification Error Occured:", error);
        }
    }
}

export default AuthHandling;