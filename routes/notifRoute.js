const express = require("express");
const router = express.Router();
const notif = require("../controllers/notifController");

// router.post("/", notif.create);
router.get("/", notif.getAll);
router.put("/:id", notif.update);
router.delete("/:doc/:id", notif.deleteByParams);

module.exports = router;
