const Router = require("express")
const router = Router()
const config = require("config")
const User = require("../models/User")
const {check, validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/auth.middleware")
const Order = require("../models/Order")

router.post("/registration",  
    [
        check('email', "Incorrect email").isEmail(),
        check("password", "Password must be longer than 3 and shorter than 12").isLength({min : 3, max : 12})
    ],
      async (req, res) => {
         try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message : "Incorrect request", errors})
            }
            const {name, email, password} = req.body

            const candidate = await User.findOne({email})
   
            if(candidate){
               return res.status(400).json({message : `User with this email ${email} already registered`})
            }
            const hashPassword = await bcrypt.hash(password, 8)
            const user = new User({name,email,password : hashPassword, roles : ['user']})
            await user.save()
            return res.status(200).json({message : "User was created"})
         }catch(err){
            console.log(err)
            return res.status(500).json({message : "Server error", err})
         }  
    }
)

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
           return res.json({message : "User is not found"})
        }

        const isPassValid = bcrypt.compareSync(password, user.password)

        if(!isPassValid){
            return res.status(400).json({ message : "Invalid password"})
        }

        const token = jwt.sign({id : user.id, roles : user.roles}, config.get("secretKey"), {expiresIn : "1h"})
        return res.json({
            token, 
            user : {
                id : user.id,
                email : user.email,
                avatar : user.avatar   
            }
        })
    }catch(err){
        console.log(err)
        return res.json({ message : "Server error"})
    }
})



router.get("", authMiddleware,
 async (req, res) => {
    try{
        const user = await User.findOne({_id : req.user.id})
        const token = jwt.sign({id : user.id, roles : user.roles}, config.get("secretKey"), {expiresIn : "1h"})
        const orders = await Order.find({user : req.user.id})
        if(!orders){
            return res.status(400).json({message : "There is no order"})
        }
        return res.json({
            token, 
            user : {
                id : user.id,
                email : user.email,
                avatar : user.avatar,
                orders 
            }
        })
    }catch(err){
        console.log(err)
        return res.json({ message : "Server error"})
    }
})

router.post("/avatar", authMiddleware, userController.uploadAvatar)
router.delete("/avatar", authMiddleware, userController.deleteAvatar)


module.exports = router 
