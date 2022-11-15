const express = require("express");
const router = express.Router();
const device = require("../controllers/deviceController");

router.post("/", device.create);
router.get("/", device.getAllDevice);
router.get("/:id", device.getOneDevice);
router.put("/:id", device.updateDevice);
router.delete("/:id", device.deleteDevice);

module.exports = router;
