const express = require("express");
const router = express.Router();
const customer = require("../controllers/customerController");

router.post("/", customer.create);
router.get("/", customer.getAllCustomer);
router.get("/:id", customer.getOneCustomer);
router.get("/branch/:id", customer.getByBranch);
router.get("/group/:id", customer.getByGroup);
router.put("/:id", customer.updateCustomer);
router.delete("/:id", customer.deleteCustomer);

module.exports = router;
