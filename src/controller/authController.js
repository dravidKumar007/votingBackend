const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const SECRET_KEY = process.env.JWT_SECRET;


const genarateKey= (req, res)=>{
    try{

        var {name,email}=req.query
        const payload = {
            name: name,
            email: email 
        };
        const options = { expiresIn: '1h' }; 
     
        res.status(200).json( {token: jwt.sign(payload, SECRET_KEY, options)});

    }catch(err){
        console.error(err);

        res.status(500).json( {error: err.message});

    }
}

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); 
    }

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports={genarateKey,verifyToken}