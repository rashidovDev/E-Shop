const Order = require("../models/Order")
const User = require("../models/User")
const config = require("config")
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")

class UserController{
    async uploadAvatar(req, res){
        try{
            const file = req.files.file
            const user = await User.findOne({_id : req.user.id})
            const avatarName = uuidv4() + ".jpg"
            file.mv(config.get("staticPath") + "\\" + avatarName)
            user.avatar = avatarName
            await user.save()
            return res.status(200).json({ message : "Avatar succesfully uploaded"})
        }catch(err){
            console.log(err)
            return res.status(500).json({ message : "Can not upload avatar"})
        }
    } 

    async deleteAvatar(req, res){
        try{
            const user = await User.findById(req.user.id)
            fs.unlinkSync(config.get("staticPath") + "\\" + user.avatar)
            user.avatar = null
            await user.save()
            return res.json({ message : "Avatar was succesfully deleted", user})
        }catch(err){
            console.log(err)
            return res.status(500).json({ message : "Server error"})
        }
    }

}

module.exports = new UserController