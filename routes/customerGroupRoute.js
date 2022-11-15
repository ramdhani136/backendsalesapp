const express = require("express");
const router = express.Router();
const cg = require("../controllers/customerGroupController");

router.post("/", cg.create);
router.get("/", cg.getAllCG);
router.get("/:id", cg.getOneCG);
router.put("/:id", cg.updateCG);
router.delete("/:id", cg.deleteCG);
router.get("/branch/:id", cg.getByBranch);

module.exports = router;
