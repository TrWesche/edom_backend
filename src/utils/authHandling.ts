// See user/merchant routes.
import * as jwt from "jsonwebtoken";
import { privatekey } from "../config/config";


class AuthHandling {
    static generateToken(queryRes, queryData) {
        // TODO: This will need to be updated to add user group roles and site / group permissions to the token based on the user request.
        // Will need to look into how to manage the dynamic nature of this better.  Not good practice to be generating new tokens all the time.
        const token = jwt.sign(queryData, privatekey, { algorithm: 'RS256', expiresIn: '8h'});

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