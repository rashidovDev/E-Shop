const Product = require("../models/Product")
const { format } = require("date-fns")
const {isValidObjectId} = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const config = require("config")

class ProductController {
    async createProduct(req, res)  {
        try {
            const { name, description, images, brand, price, category, countInStock, rating, isFeatured } = req.body
            const file = req.files.file
            if (!name || !description || !images || !brand || !price || !category || !countInStock || !rating || !isFeatured) {
                res.status(401).json({ message: "Please fill all required fields" })
            }
            const dateTime = format(new Date(), 'yyyy/MM/dd HH:mm:ss')
            const product = new Product({
                name, description, images, brand, price, category, countInStock, rating, isFeatured, dateCreated: dateTime
            })
            await product.save()
            return res.status(200).json({ message: "Product succesfully created", product })
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not create product" })
        }
    }

    async getProducts(req, res) {
        try {
            const products = await Product.find()
            if (!products) {
                res.status(400).json({ message: "There are no products" })
            }
            res.status(200).json(products)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get products" })
        }
    }

    async getProductList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.limit) || 1;
            const search = req.query.search || '';

            const products = await Product.find()
            const totalItems = await Product.countDocuments()
            console.log(totalItems)

            const filteredItems = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
            if(!filteredItems){
                return products
            }
            const start = (page - 1) * perPage;
            const end = page * perPage;

            const paginatedItems = filteredItems.slice(start, end);
            res.json({totalItems,paginatedItems});
        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    async getCategories(req, res){
        try{
            const categories = [
           {name : "Smartphone"},
           {name : "Laptop"},
           {name : "Accessory"},
        ]
            return res.send(categories)
        }catch(err){
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    async getProductById(req, res) {
        try {
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
            const id = req.params.id
            const product = await Product.findById({ _id: id }).populate("category")
            if (!product) {
                res.status(400).json({ message: "There is no product" })
            }
            res.status(200).json(product)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get product" })
        }
    }

    async deleteProduct(req, res) {
        try {
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
            const deletedProduct = await Product.findOne({ _id: req.params.id })
            console.log(deletedProduct.image)
            if(fs.existsSync(config.get("staticPath") + "product\\" + deletedProduct.image)){
                fs.unlinkSync(config.get("staticPath") + "product\\" + deletedProduct.image)
            }
            await Product.findOneAndRemove({ _id: req.params.id })
            if (!deletedProduct) {
                return res.status(400).json({ message: "DeletedItem not found" })
            }
            return res.status(200).json({ message: "Succesfully deleted", deletedProduct })
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not delete" })
        }
    }

    async updateProduct(req, res) {
        try {
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
            const { name, description, image, images, brand, price, category, countInStock, rating, isFeatured } = req.body
            const dateTime = format(new Date(), 'yyyy/MM/dd HH:mm:ss')
            const updateProduct = await Product.findOneAndUpdate(
                { _id: req.params.id }, {
                name, description,
                image, images,
                brand, price,
                category, countInStock,
                rating, isFeatured,
                dateCreated: dateTime
            },
                { new: true }
            )
            if (!updateProduct) {
                return res.status(400).json({ message: "UpdateItem not found" })
            }
            return res.status(200).json({ message: "Succesfully updated", updateProduct })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: "Can not update" })
        }
    }

    async getProductsCount(req, res) {
        try {
            const products = await Product.countDocuments()
            if (!products) {
                res.status(400).json({ message: "There are no products" })
            }
            res.status(200).json({ count : products})
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get products" })
        }
    }

    async getFeaturedProducts(req, res) {
        try {
            const products = await Product.find({isFeatured : true})
            if (!products) {
                res.status(400).json({ message: "There are no products" })
            }
            res.status(200).json({ count : products})
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get products" })
        }
    }

    async getFeaturedProductsWithCount(req, res) {
        try {
            const count = req.params.count ? req.params.count : 0

            const products = await Product.find({isFeatured : true}).limit(count)
            if (!products) {
                res.status(400).json({ message: "There are no products" })
            }
            res.status(200).json(products)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get products" })
        }
    }

    async getProductsWithQuery(req, res) {
        try{
         let filter = {}
         if(req.query.categories){
            filter = {category : req.query.categories.split(',')}
         }
         const productList = await Product.find(filter).populate('category')

         if(!productList){
            return res.status(400).json({ message : "There is no productList"})
         }

         return res.status(200).json(productList)
        }catch(e){
            console.log(e)
            return res.status(400).json({ message : "Server error"})
        }
    }
}

module.exports = new ProductController()
