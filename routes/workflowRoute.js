const express = require("express");
const router = express.Router();
const controller = require("../controllers/workflowController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/disabled", controller.disableWorkflow);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.deleteData);
router.delete("/child/:id", controller.deleteChildById);

module.exports = router;
