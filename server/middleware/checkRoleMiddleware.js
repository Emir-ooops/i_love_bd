const jwt = require("jsonwebtoken");

module.exports = function(role){
    return function (req, res,next) {
        if(req.method === 'OPTIONS'){
            next()
        }
        try{
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                return res.status(401).json({error:"Unauthorized"})
            }
            const decoded= jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded
            if (decoded.role !== 'role'){
                return res.status(403).json({error:"У вас нет доступа"})
            }
            next()
        }catch(e){
            res.status(401).json({error:"Unauthorized"})
        }
    }
}

