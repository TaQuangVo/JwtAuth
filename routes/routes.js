const express = require("express")
const { Mongoose } = require("mongoose")
const {generateHashedAndSalt, issueJWT, validateToken, validatePassword} = require("../auth/helper-functions")
const {userModel} = require("../database")


const userRouter = express.Router()





/**
 * midlewares
 */
const AuthenticateUser = (req,res,next) => {
    const tokenParts = req.headers.authorization.split(" ");

    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    
        const isTokenValid = validateToken(tokenParts[1]);

        if(isTokenValid){
            req.jwt = isTokenValid
            next()
        }else{
            res.status(401).json({
                success:false,
                msg:"Invalid token"
            })
        }
    }else{
        res.status(401).json({
            success:false,
            msg:"Invalid token"
        })
    }

}


/**
 * user Routes
 */

userRouter.get("/", (req,res) => {
    console.log(req.jwt)
    res.send("This is the user page")
})

userRouter.get("/protected-route", AuthenticateUser, (req, res) => {
    console.log(req.jwt)
    res.send("This is a protected route")
})

userRouter.post("/login", (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    userModel.findOne({username:username}).then( user => {
        if(!user){
            res.status("400").json({
                success:false,
                msg:"User not found!"
            })
        }else {
            const isPwdValid = validatePassword(password,user.hashedPwd,user.salt)

            if(!isPwdValid){
                res.status("400").json({
                    success:false,
                    msg:"Invalid password"
                })
            }else{
                const tokenData = issueJWT(user)

                res.status(200).json({
                    success:true,
                    user:{
                        _id:user._id,
                        username:user.username,
                    },
                    credential:tokenData
                })
            }
        }
    }).catch(err => console.log(err))
})  

userRouter.post("/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    userModel.findOne({username:username}).then( user => {
        if(user){
            res.status("400").json({
                success:false,
                msg:"Username exit"
            })
        }else {
            const hashedData = generateHashedAndSalt(password)

            const newUser = new userModel({username:username,hashedPwd:hashedData.hashedPwd, salt:hashedData.salt})

            newUser.save().then(user => {

                const tokenData = issueJWT(user)

                res.status(201).json({
                    success:true,
                    user:{
                        _id:user._id,
                        username:user.username,
                    },
                    credential:tokenData
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    success:false,
                    msg:"Something went wrong"
                })
            })
        }
    }).catch(err => console.log(err))
})


module.exports = userRouter     