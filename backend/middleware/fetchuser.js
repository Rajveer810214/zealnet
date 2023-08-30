const jwt = require('jsonwebtoken')
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')
    if(!token){
        res.status(400).json("Please try to enter the correct token")
    }
    try {
        const data=jwt.verify(token,process.env.JWT_SECRET);
        req.user=data.user;
        next();
        
    } catch (error) {
        res.status(400).json("Please try to enter the correct token")

    }

}
module.exports=fetchuser;