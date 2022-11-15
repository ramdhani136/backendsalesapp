const express = require("express");
const router = express.Router();
const branch = require("../controllers/branchController");

router.post("/", branch.create);
router.get("/", branch.getAllBranch);
router.get("/:id", branch.getOneBranch);
router.put("/:id", branch.updateBranch);
router.delete("/:id", branch.deleteBranch);

module.exports = router;
