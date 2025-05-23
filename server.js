import http from "http"
import fs from "fs"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import { verifytoken } from "./middlewares/jwt-auth.js"

dotenv.config();

const secretKey = process.env.SECRET_KEY

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url == "/signup") {

        let userarray = []
        let body = ""
        let user = {}

        req.on("data", chunk => {
            body += chunk.toString()
        })

        req.on("end", () => {
            const data = JSON.parse(body)
            user = {
                email: data.email,
                password: data.password
            };


            if (fs.existsSync("users.json")) {
                const existingdata = fs.readFileSync("users.json", "utf-8")
                userarray = JSON.parse(existingdata)
            }
            userarray.push(user)
            fs.writeFileSync("users.json", JSON.stringify(userarray, null, 2), "utf8")

            res.writeHead(200, { "content-type": "text/plain" })
            res.end(`signup successfull ${user.email},${user.password}`)

        })

    }

    else if (req.method === "POST" && req.url == "/login") {
        let body = ""
        req.on("data", chunk => {
            body += chunk.toString()
        })

        req.on("end", () => {
            const creditials = JSON.parse(body)
            const read = fs.readFileSync("users.json", "utf-8")
            const data = JSON.parse(read)
            const user = data.find(u =>
                u.email === creditials.email &&
                u.password === creditials.password
            )
            if (user) {

                const token = jwt.sign(user, secretKey, { expiresIn: "1hr" })
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Login successful", token }));
                

            }
            else {
                res.end("invalid username or password")
            }
        })

    }
    else if (req.method === "GET" && req.url === "/products") {
       
        if (verifytoken(req, res)) {
            const products = fs.readFileSync("product.json", "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(products);
        }

    }

})

server.listen(5000, () => {
    console.log("server running on 5000");

})