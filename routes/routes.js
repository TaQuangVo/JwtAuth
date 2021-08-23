const express = require("express")
const { Mongoose } = require("mongoose")
const {generateHashedAndSalt, issueJWT} = require("../auth/helper-functions")
const {userModel} = require("../database")


const router = express.Router()




router.get("/", (req,res) => {
    res.send("This is the user page")
})

router.post("/register", (req, res) => {
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


module.exports = router