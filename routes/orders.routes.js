const Router = require("express")
const router = Router()
const orderController = require("../controllers/orderController")
const adminMiddleware = require("../middleware/admin.middleware")
const authMiddleware = require("../middleware/auth.middleware")

router.post('', authMiddleware, orderController.CreateOrder)
router.get('', orderController.getAllOrders)
router.get('/totalsales', orderController.getTotalSales)
router.get('/:id', orderController.getOrderById)
router.put('/:id', orderController.updateOrderById)
router.delete('/:id', orderController.deleteOrderById)

module.exports = router