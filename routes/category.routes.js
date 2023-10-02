const Router = require("express")
const categoryController = require("../controllers/categoryController")
const router = Router()

router.get("/", categoryController.getCategory)
router.get("/:id", categoryController.getCategoryById)
router.post("/", categoryController.createCategory)
router.delete("/:id", categoryController.deleteCategory)
router.put("/:id", categoryController.updateCategory)

module.exports = router

