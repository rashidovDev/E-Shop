const Router = require("express")
const router =  Router()
const productController = require("../controllers/productController")

router.post('', productController.createProduct)
router.get('', productController.getProducts)
router.get('/:id', productController.getProductById)
router.delete('/:id', productController.deleteProduct)
router.put('/:id', productController.updateProduct)
router.get('/get/count', productController.getProductsCount)
router.get('/get/featured', productController.getFeaturedProducts)
router.get('/get/featured/:count', productController.getFeaturedProductsWithCount )
router.get('/get/featured/:count', productController.getProductsWithQuery )

module.exports = router