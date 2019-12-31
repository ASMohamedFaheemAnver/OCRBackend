const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'i_type_rifa_to_secure_my_token');
        next();
    }catch(err){
        res.status(401).json({message: 'AUTH FAILED!'});
    }
};