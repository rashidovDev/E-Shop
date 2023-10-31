const Router = require("express")
const router = Router()
const orderController = require("../controllers/orderController")
const adminMiddleware = require("../middleware/admin.middleware")
const authMiddleware = require("../middleware/auth.middleware")

router.post('', authMiddleware,  orderController.CreateOrder)
router.get('', orderController.getAllOrders)
router.get('/order-list', orderController.getAllOrdersbyPagination)
router.get('/totalsales', adminMiddleware, orderController.getTotalSales)
router.get('/:id', adminMiddleware, orderController.getOrderById)
router.put('/status/:id',adminMiddleware,  orderController.updateStatusById)
router.put('/:id', orderController.updateOrderById)
router.delete('/:id', adminMiddleware, orderController.deleteOrderById)

module.exports = router 