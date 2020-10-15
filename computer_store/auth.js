const jwt = require("jsonwebtoken")
const SECRET_KEY = "Indonesia1011"

const auth = (req, res, next) => {
    let header = req.headers.authorization
    let token = header.split(" ")[1]
    let jwtheader = {
        algorithm: "HS256"
    }


    if (token === undefined) {
        res.json({ massage: "Unauthorization" })
    } else {
        jwt.verify(token, SECRET_KEY, jwtheader, (err, user) => {
            if (err) {
                console.log(err)
            } else {
                next()
            }
        })
    }
}

module.exports = auth