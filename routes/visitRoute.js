const express = require("express");
const router = express.Router();
const visit = require("../controllers/visitController");
const multer = require("multer");
const path = require("path");

const uploadPath = path.join(__dirname, "../assets/images");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("upimg"), visit.create);
router.get("/", visit.getAllVisit);
router.get("/view/:name", visit.getByName);
router.get("/:id", visit.getOneVisit);
router.get("/status/:status", visit.getByStatus);
router.put("/:id", upload.single("upimg"), visit.updateVisit);
router.delete("/:id", visit.deleteVisit);
router.post("/send/message", visit.message);
router.get("/user/:id", visit.getByUser);

module.exports = router;
