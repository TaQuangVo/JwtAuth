const mongoose = require("mongoose")



/**
 *  mongodb set up
 */
 const dbUrl = "mongodb://mongod/app"

 const dbConnection = mongoose.createConnection(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true})
 
 dbConnection.on("connected", () => {
     console.log("Connected to db successfully!")
 })




/**
 * schemas
 */
 const userSchema = mongoose.Schema({
     username:String,
     hashedPwd:String,
     salt:String,
 })




/**
 * models
 */
const userModel = dbConnection.model("users", userSchema)




/**
 * exports
 */
module.exports = {dbConnection, userModel}