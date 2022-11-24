const express = require("express");
const router = express.Router();
const controller = require("../controllers/listScheduleController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/doc/:type", controller.getByType);
router.get("/:id", controller.getOne);
router.get("/schedule/:id", controller.getBySchedule);
router.put("/:id", controller.update);
router.delete("/:id", controller.deleteData);

module.exports = router;
