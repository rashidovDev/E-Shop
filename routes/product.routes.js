const Router = require("express")
const router =  Router()
const productController = require("../controllers/productController")

router.post('/product', productController.createProduct)
router.get('/product', productController.getProducts)

module.exports = router