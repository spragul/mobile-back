var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const saltRounts = 10;
//hash password
const hashpassword = async (password) => {
    let salt = await bcrypt.genSaltSync(saltRounts);
    let hashedpassword = await bcrypt.hash(password, salt);
    return hashedpassword;
}

//compare password
const hashCompare = async (password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword)
}

//create token
const createToken = async (payload,timeExpires) => {
    let token = jwt.sign(payload, process.env.secretKey, { expiresIn: timeExpires });
    return token;
}

//validate
const validate = async (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        let data = await jwt.decode(token);
        if (Math.floor((+new Date()) / 1000) < data.exp) {
            next();
        } else {
            res.status(4001).send({ message: "Token Expired" })
        }
    } else {
        res.status(400).send({ message: "Token not found" })
    }
}

module.exports = { hashpassword, hashCompare, createToken,validate }