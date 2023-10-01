const Product = require("../models/Product")

class ProductController {
    async createProduct(req, res){
        try{
            const {name, image, countInStock} = req.body
            if(!name || !image || !countInStock){
                res.status(401).json({message : "Please fill all required fields"})
            }
            const product = new Product({
                name, image, countInStock   
            })
            await product.save()
            return res.status(200).json({ message : "Product succesfully created", product} )
        }catch(err){
            console.log(err)
            return res.status(400).json({ message : "Can not create product"})
        }
    }

    async getProducts(req, res){
        try{
            const products = await Product.find()
            if(!products){
                res.status(400).json({message : "There are no products"})
            }
            res.status(200).json(products)
        }catch(err){
            console.log(err)
            return res.status(400).json({ message : "Can not get products"})
        }
       
    }
}

module.exports = new ProductController()