const express = require("express");
const router = express.Router();
const controller = require("../controllers/workflowActionController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.deleteData);

module.exports = router;