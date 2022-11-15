const express = require("express");
const router = express.Router();
const contact = require("../controllers/contactController");

router.post("/", contact.create);
router.get("/", contact.getAll);
router.get("/:id", contact.getOne);
router.get("/status/:status", contact.getByStatus);
router.get("/customer/:id", contact.getByCustomer);
router.put("/:id", contact.update);
router.delete("/:id", contact.deleteData);

module.exports = router;
