const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { uploadDiploma } = require("../utils/uploadConfig");
const { authenticateToken } = require("../middleware/authMiddleware");

// 📤 Загрузка диплома
router.post(
  "/upload",
  authenticateToken,
  uploadDiploma.single("diploma"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Файл диплома не загружен" });
    }

    console.log("🟢 Загружен файл:", req.file);
    res.json({ fileUrl: `/uploads/diplomas/${req.file.filename}` });
  }
);

// ❌ Удаление диплома
router.delete("/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/diplomas", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Файл не найден" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Ошибка удаления файла:", err);
      return res.status(500).json({ message: "Ошибка при удалении" });
    }

    res.json({ message: "✅ Диплом удалён" });
  });
});

module.exports = router;
