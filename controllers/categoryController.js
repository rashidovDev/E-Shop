const Category = require("../models/Category")

class CategoryController {
      async createCategory(req, res){
        try{
            const {name, icon, color} = req.body
            if(!name || !icon || !color){
                res.status(401).json({ message : "Please fill all the required fields"})
            }
            const category = new Category({
                name, icon, color
            })
            await category.save()
            return res.status(200).json({message : "Category created succesfully", category})
        }catch(e){
        console.log(e)
        res.status(400).json({message : "Category error"})
        }
      }

      async getCategory(req, res){
        try{
            const category =await Category.find()
            if(!category){
                res.status(401).json({ message : "Can not get Category"})
            }
            return res.json(category)
        }catch(e){
            console.log(e)
            res.status(400).json({message : "Category error"})
        }
      }

      
      async getCategoryById(req, res){
        try{
            const categoryItem =await Category.findById({_id : req.params.id})
            if(!categoryItem){
                res.status(401).json({ message : "Can not get Category"})
            }
            return res.json(categoryItem)
        }catch(e){
            console.log(e)
            res.status(400).json({message : "Category error"})
        }
      }

      async deleteCategory(req, res){
        try{
            const {id} = req.params 

            const deletedItem = await Category.findOneAndRemove({_id:id})
            if(!deletedItem) {
                return res.status(404).json({ message : "CategoryItem not found"})
            }
            return res.status(200).json({message : "Succesfully deleted", deletedItem})

        }catch(e){
            console.log(e)
            res.status(400).json({message : "Deleting Error"})
        }
      }

      async updateCategory(req, res){
           try{
            const {name,icon,color} = req.body
            const {id} = req.params
            const updateItem = await Category.findOneAndUpdate({
                _id : id,
                name,
                icon, 
                color},
                {new : true}
                )
            if(!updateItem){
                res.status(404).json({ message : "CategoryItem not found"})
            }
            return res.status(200).json({message : "Updated succesfully", updateItem})

           }catch(e){
            console.log(e)
            res.status(400).json({message : "Updating Error"})
           }
      }
}


module.exports = new CategoryController()