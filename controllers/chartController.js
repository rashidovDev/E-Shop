const User = require("../models/User")
const Product = require("../models/Product")

class ChartController{
     async getUsers(req, res){
        try{
        const users = await User.find().select()
        res.json(users)
        }catch(err){
            return res.status(500).json({message : "Server error"})
        }
     }
}

module.exports = new ChartController()

