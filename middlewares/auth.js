const {validateToken} = require("../auth/helper-functions")




/**
 * midlewares
 */
const AuthenticateUser = (req,res,next) => {
    const tokenParts = req.headers.authorization.split(" ");

    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    
        const isTokenValid = validateToken(tokenParts[1]);

        if(isTokenValid.exp < Date.now()){
            res.status(401).json({
                success:false,
                msg:"Token exprired"
            })
        }

        console.log(isTokenValid)
        console.log(Date.now())

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


module.exports = {AuthenticateUser}