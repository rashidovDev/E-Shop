const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next) => {
  if(req.method === "OPTIONS"){
    return next()
  }
  try{
    const authHeader = req.headers.authorization || req.headers.authorization;
  if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({message : "Auth error"})
  console.log(authHeader) //Bearer token

  const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({ message : "Auth error"})
        }
        const decoded = jwt.verify(token, config.get("secretKey"))
        let roles = decoded.roles
        if(!roles.includes("admin")){
            return res.status(401).json({ message : "Auth error"})
        }
        next()
  }catch(err){
    console.log(err)
    res.status(400).json({ message : "Auth error"})
  }
}
