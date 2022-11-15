const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");
const { PermissionData } = require("../middleware/DocRule");
const { verifyToken } = require("../middleware/VerifiyToken");
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

router.post("/", upload.single("upimg"), verifyToken, PermissionData, users.register);
router.get("/", verifyToken, PermissionData, users.getUsers);
router.get("/:id", verifyToken, PermissionData, users.getUsersById);
router.put(
  "/:id",
  upload.single("upimg"),
  verifyToken,
  PermissionData,
  users.updateData
);
router.post("/login", users.login);
router.get("/token/:id", users.refreshToken);
router.delete("/logout", users.logout);
router.delete("/:id", users.deleteUser);

module.exports = router;
