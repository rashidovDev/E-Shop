const Order = require("../models/Order")
const User = require("../models/User")
const config = require("config")
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const { isValidObjectId } = require("mongoose")
const bcrypt = require("bcryptjs")

class UserController {

    async deleteUser(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ message: "Invalid id" })
            }
            const deletedUser = await User.findOneAndRemove({ _id: req.params.id })
            if (!deletedUser) {
                return res.status(400).json({ message: "DeletedItem not found" })
            }
            return res.status(200).json({ message: "Succesfully deleted", deletedUser })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not delete user" })
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findOne({ _id: req.params.id })
            const avatarName = uuidv4() + ".jpg"
            file.mv(config.get("staticPath") + "user\\" + avatarName)
            user.avatar = avatarName
            await user.save()
            return res.status(200).json({ message: "Avatar succesfully uploaded" })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not upload avatar" })
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.params.id)
            fs.unlinkSync(config.get("staticPath") + "user\\" + user.avatar)
            user.avatar = null
            await user.save()
            return res.json({ message: "Avatar was succesfully deleted", user })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Server error" })
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users);

        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Server error" })
        }
    }

    async searchUser(req, res) {
        try {
            const searchName = req.query.search
            let users = await User.find()
            const newUser = users.filter((user) => user.name.toLowerCase().includes(searchName))
            return res.json(newUser)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Server error", err })
        }
    }

    async getUserById(req, res) {
        try {
            const user = await User.findOne({_id : req.params.id})
            if(!user){
            return  res.status(400).json({message : "User is not found"})
            }
            return res.json(user)
        
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.limit) || 1;
            const search = req.query.search || '';

            const users = await User.find()
            const totalItems = await User.countDocuments()
            console.log(totalItems)

            // Implement your search and pagination logic, such as querying a database.
            // First, filter the data based on the search term.
            const filteredItems = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
            if(!filteredItems){
                return users 
            }
            // Implement your pagination logic, such as querying a database or filtering data.
            // Calculate the start and end indices based on page and perPage.
            const start = (page - 1) * perPage;
            const end = page * perPage;

            // Simulate a data source (replace this with your actual data retrieval logic)

            // Paginate the data
            const paginatedItems = filteredItems.slice(start, end);
            

            res.json({totalItems,paginatedItems});

        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    async getCustomers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.limit) || 1;
            const search = req.query.search || '';

            const users = await User.find()
            const customers = users.filter(user => !user.roles.includes("admin"))
            const totalItems = customers.length
            console.log(totalItems)

            // Implement your search and pagination logic, such as querying a database.
            // First, filter the data based on the search term.
            const filteredItems = customers.filter(customer => customer.username.toLowerCase().includes(search.toLowerCase()));
            if(!filteredItems){
                return users 
            }
            // Implement your pagination logic, such as querying a database or filtering data.
            // Calculate the start and end indices based on page and perPage.
            const start = (page - 1) * perPage;
            const end = page * perPage;

            // Simulate a data source (replace this with your actual data retrieval logic)

            // Paginate the data
            const paginatedItems = filteredItems.slice(start, end);
            

            res.json({totalItems,paginatedItems});

        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    async getAdmins(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.limit) || 1;
            const search = req.query.search || '';

            const users = await User.find()
            const admins = users.filter(user => user.roles.includes("admin"))
            const totalItems = admins.length
            console.log(totalItems)

            // Implement your search and pagination logic, such as querying a database.
            // First, filter the data based on the search term.
            const filteredItems = admins.filter(admin => admin.username.toLowerCase().includes(search.toLowerCase()));
            if(!filteredItems){
                return users 
            }
            // Implement your pagination logic, such as querying a database or filtering data.
            // Calculate the start and end indices based on page and perPage.
            const start = (page - 1) * perPage;
            const end = page * perPage;

            // Simulate a data source (replace this with your actual data retrieval logic)

            // Paginate the data
            const paginatedItems = filteredItems.slice(start, end);
            
            res.json({totalItems,paginatedItems});

        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }


    async updateUser(req, res) {
         try{
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
         
        const user = await User.findOne({_id : req.params.id})
        if(!user){
            return res.status(400).json({ message : "User is not found"})
        }
        const hashPassword = await bcrypt.hash(req.body.password, 8)

         const updateUser = await User.findOneAndUpdate(
            {_id : req.params.id},
            {
             username : req.body.username,
             email : req.body.email,
             password : hashPassword,
             country : req.body.country
            },
            {new : true}
            )
            return res.status(200).json({ message : "Succesfully updated", updateUser})
         }catch(err){
         return res.status(500).json({ message : "Server error"})
         }
    }

    async updateUserRole(req, res) {
        try{
           if(!isValidObjectId(req.params.id)){
               return res.status(400).json({ message : "Invalid id"})
           }

       const user = await User.findOne({_id : req.params.id})
       
       if(!user.roles.includes("admin")){
        const newRole = ["user", "admin"]
        const updateUser = await User.findOneAndUpdate(
            {_id : req.params.id},
            {
             roles : newRole
            },
            {new : true}
            )
            return res.status(200).json({ message : "Succesfully updated", updateUser})
       }else{
        const userRole = ["user"]
        const updateUser = await User.findOneAndUpdate( 
            {_id : req.params.id},
            {
             roles : userRole
            },
            {new : true}
            )
            return res.status(200).json({ message : "Succesfully updated", updateUser})
       }

        }catch(err){
        return res.status(500).json({ message : "Server error"})
        }
   }
}

module.exports = new UserController