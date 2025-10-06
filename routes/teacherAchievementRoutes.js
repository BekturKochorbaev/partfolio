const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const uploadAchievementImage = require("../utils/uploadAchievementImage");

const {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/teacherAchievementController");

// 🔐 Защищённые маршруты
router.get("/", authenticateToken, getAllAchievements);

router.post(
  "/",
  authenticateToken,
  uploadAchievementImage.array("images"),
  createAchievement
);

router.put(
  "/:id",
  authenticateToken,
  uploadAchievementImage.array("images"),
  updateAchievement
);

router.delete("/:id", authenticateToken, deleteAchievement);

// ✅ Публичный маршрут (не требует авторизации)
router.get("/public", async (req, res) => {
  const controller = require("../controllers/teacherAchievementController");
  return controller.getAllAchievements(req, res);
});

module.exports = router;
