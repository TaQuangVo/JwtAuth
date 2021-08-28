const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const jsonWebToken = require("jsonwebtoken")


const pubKeyPath = path.join(__dirname, "..", "/id_rsa_pub.pem")
const privKeyPath = path.join(__dirname, "..", "/id_rsa_priv.pem")

const PUB_KEY = fs.readFileSync(pubKeyPath, "utf8")
const PRIV_KEY = fs.readFileSync(privKeyPath,"utf8")


const generateHashedAndSalt = (password) => {
    const salt = crypto.randomBytes(32).toString("hex")

    const hashedPwd = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    return {salt,hashedPwd}
}

const validatePassword = (password, hashedPwd, salt) => {
    const hashedPwdVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    const isValid = hashedPwdVerify === hashedPwd

    return isValid
}

const validateToken = (token) => {
    try {
        const verification = jsonWebToken.verify(token,PUB_KEY,{algorithms:"RS256"})
        return verification;
    } catch (err) {
        console.log(err)
        return false
    }
}

const issueJWT = (user) => {
    const userId = user._id
    const expiresIn = "1d"
    
    const payload = {
        sub: userId,
        iat:Date.now()
    }

    const signOptions = {
        expiresIn:expiresIn,
        algorithm:"RS256"
    }

    const signedToken = jsonWebToken.sign(payload, PRIV_KEY, signOptions)

    return {
        token:"Bearer " + signedToken,
        expiresIn: expiresIn,
    }
}

module.exports = {generateHashedAndSalt, validatePassword, validateToken, issueJWT}