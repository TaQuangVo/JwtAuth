const express = require("express")
const {userModel} = require("./database")
const userRouter = require("./routes/routes")







const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))







app.get("/", (req,res)=>{
    const newUser = new userModel({username:"taquang",hashedPwd:"this is hashed", salt:"salt"})

    newUser.save().catch(err=>console.log(err))

    userModel.find({_id:"123"}).then( user => {
        if(!user){res.send("User not found")}
        else {res.status(200).json(user)}
    }).catch(err => console.log(err))
})


app.use("/user", userRouter)



const port = 3000

app.listen(port,()=>{
    console.log("App listen on port " + port)
})