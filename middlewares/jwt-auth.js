import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY
export function verifytoken(req, res) {
    const auth = req.headers["authorization"];
    console.log("Auth header:", auth);

    if (auth && auth.startsWith("Bearer ")) {
        const token = auth.split(" ")[1];
        console.log("Token received:", token);

        try {
            const decode = jwt.verify(token, secretKey);
            console.log("Token decoded:", decode);
            req.user = decode;
            return true;
        } catch (err) {
            console.error("JWT verification failed:", err);
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.end("Invalid or expired token.");
            return false;
        }
    } else {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Authorization header missing or malformed.");
        return false;
    }
}
