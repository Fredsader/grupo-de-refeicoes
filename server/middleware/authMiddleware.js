const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({erro:"Acesso negado"});
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer'){
        return res.status(401).json({erro: "Formato inválido no token"});
    }

    const token = parts[1];
    try{
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedPayload;

        next()
    }catch(err){
        return res.status(403).json({erro: "Tokken inválido ou expirado"});
    }
};

module.exports = authGuard;