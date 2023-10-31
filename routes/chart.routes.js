const Router = require("express")
const adminMiddleware = require("../middleware/admin.middleware")
const chartController = require("../controllers/chartController")
const router = Router()

router.get("/users", adminMiddleware, chartController.getUsers)

module.exports = router


