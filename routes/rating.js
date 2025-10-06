const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const {
  AcademicMobility,
  QualificationImprovement, // ✅ правильная модель
  MethodicalMaterial,
  PublishedTextbook,
  ScientificPublication,
  GrantParticipation,
  CuratorActivity,
  ExpertActivity
} = require("../models");

// Вспомогательная функция для подсчёта записей за последние N лет
const countRecords = async (Model, teacherId, yearsBack) => {
  const dateThreshold = new Date();
  dateThreshold.setFullYear(dateThreshold.getFullYear() - yearsBack);
  return await Model.count({
    where: {
      teacherId,
      createdAt: {
        [Op.gte]: dateThreshold,
      },
    },
  });
};

// Роут: расчёт рейтинга преподавателя
router.get("/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const weights = {
      AcademicMobility: 10,
      QualificationImprovement: 8,
      MethodicalMaterial: 7,
      PublishedTextbook: 10,
      ScientificPublication: 9,
      GrantParticipation: 10,
      CuratorActivity: 5,
      ExpertActivity: 6,
    };

    const records = await Promise.all([
      countRecords(AcademicMobility, teacherId, 3),
      countRecords(QualificationImprovement, teacherId, 3),
      countRecords(MethodicalMaterial, teacherId, 3),
      countRecords(PublishedTextbook, teacherId, 3),
      countRecords(ScientificPublication, teacherId, 3),
      countRecords(GrantParticipation, teacherId, 3),
      countRecords(CuratorActivity, teacherId, 3),
      countRecords(ExpertActivity, teacherId, 3),
    ]);

    const score =
      records[0] * weights.AcademicMobility +
      records[1] * weights.QualificationImprovement +
      records[2] * weights.MethodicalMaterial +
      records[3] * weights.PublishedTextbook +
      records[4] * weights.ScientificPublication +
      records[5] * weights.GrantParticipation +
      records[6] * weights.CuratorActivity +
      records[7] * weights.ExpertActivity;

    const maxPossible = 100;
    const percentage = Math.min((score / maxPossible) * 100, 100);

    console.log("👉 Рейтинг:", {
      records,
      score,
      percentage,
    });

    res.json({ rating: Math.round(percentage) });
  } catch (error) {
    console.error("❌ Ошибка при подсчёте рейтинга:", error);
    res.status(500).json({ error: "Ошибка сервера при подсчёте рейтинга" });
  }
});

module.exports = router;
