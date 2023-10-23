const Router = require("express")
const router = Router()
const orderController = require("../controllers/orderController")
const adminMiddleware = require("../middleware/admin.middleware")
const authMiddleware = require("../middleware/auth.middleware")

router.post('', authMiddleware, adminMiddleware, orderController.CreateOrder)
router.get('', adminMiddleware, orderController.getAllOrders)
router.get('/totalsales', adminMiddleware, orderController.getTotalSales)
router.get('/:id', adminMiddleware, orderController.getOrderById)
router.put('/:id',adminMiddleware,  orderController.updateOrderById)
router.delete('/:id', adminMiddleware, orderController.deleteOrderById)

module.exports = router