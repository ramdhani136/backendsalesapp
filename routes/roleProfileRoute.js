const express = require("express");
const router = express.Router();
const profile = require("../controllers/roleProfileController");

router.post("/", profile.create);
router.get("/", profile.getAllProfile);
router.get("/:id", profile.getOneProfile);
router.put("/:id", profile.updateProfile);
router.delete("/:id", profile.deleteProfile);

module.exports = router;
