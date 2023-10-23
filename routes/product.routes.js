const Router = require("express")
const router = Router()
const productController = require("../controllers/productController")
const authMiddleware = require("../middleware/auth.middleware")
const adminMiddleware = require("../middleware/admin.middleware")
const Product = require("../models/Product")
const Category = require("../models/Category")
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, 'static/product')
  },
  filename : (req, file, cb) => {
    cb(null, `${uuidv4()}.jpg`)
  } 
})

const upload = multer({ storage : fileStorage})
  
router.post('', upload.single("image"), async (req, res) => {
    // Handle the uploaded image here and save it to your Product model
    try{
      const basePath = `${req.protocol}://${req.get('host')}`;
      console.log(basePath)
      console.log(req.file)
       const newProduct = new Product({
        name : req.body.name,
        image : req.file.filename,
        description : req.body.description,
        // images : req.body.images,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : 1,
        isFeatured : false,
        dateCreated : Date.now()
       })
       await newProduct.save()
      return res.status(200).json({message : "Succesfully created", newProduct})
    }catch(err){
        res.status(500).json({ err: 'Error saving product' });
      };
  });

  // function isFileExist(){
  //     if(req.file.)
  // }

  router.put('/:id',  upload.single("image"), async (req, res) => {
    // Handle the uploaded image here and save it to your Product model
    try{
      const basePath = `${req.protocol}://${req.get('host')}`;
      console.log(basePath)
      console.log(req.file)
      const product = await Product.findOneAndUpdate(
        { _id : req.params.id},
        {
          name : req.body.name,
          image :req.file.filename,
          description : req.body.description,
          // images : req.body.images,
          brand : req.body.brand,
          price : req.body.price,
          category : req.body.category,
          countInStock : req.body.countInStock,
          rating : 1,
          isFeatured : false,
          dateCreated : Date.now()
        },
        {
          new : true
        }
        )
        return res.status(200).json({message : "Succesfully created", product})
    }catch(err){
        res.status(500).json({ err: 'Error saving product' });
      };
  });



// Define storage for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Define the directory where uploaded images will be stored
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//   },
// });

// const upload = multer({ storage: storage });

// router.post('', productController.createProduct)
router.get('', productController.getProducts)
router.get('/categories', productController.getCategories)
router.get('/product-list', productController.getProductList)
router.get('/:id', productController.getProductById)
router.delete('/:id', productController.deleteProduct)
// router.put('/:id', productController.updateProduct)
router.get('/get/count', productController.getProductsCount)
router.get('/get/featured', productController.getFeaturedProducts)
router.get('/get/featured/:count', productController.getFeaturedProductsWithCount)
router.get('/get/featured/:count', productController.getProductsWithQuery)

module.exports = router 
