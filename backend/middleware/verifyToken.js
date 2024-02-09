const JWT_SECRET = "yashpanchaluasnnasuanausas";
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
        // console.log(bearerHeader)
  if (!bearerHeader) {
    return res.status(403).json({ error: "Token is not provided" });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
//   console.log(token)

  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    // console.log(verifiedToken)
    req.decodedToken  = verifiedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Token not verified" });
  }
};

module.exports = verifyToken;

// const JWT_SECRET = "yashpanchaluasnnasuanausas"
// const jwt = require('jsonwebtoken')

// const verifyToken = (req,res,next) => {

//     const bearerHeader = req.headers['authorization'];
    
//     if(typeof bearerHeader !== 'undefined'){

//         const bearer = bearerHeader.split(" ")
//         const token = bearer[1];
//         req.token = token;
//         const verifiedToken = jwt.verify(req.token, JWT_SECRET)
//         if(!verifiedToken){
//             return res.status(401).json({error: "TOKEN NOT VERIFIED"})
//         }
//         next();
//     }else{
//         res.send({result : "Token is not valid"})
//     }
// }   

// module.exports = verifyToken