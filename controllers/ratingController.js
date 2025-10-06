const { Op } = require("sequelize");
const {
  ScientificPublication,
  GrantParticipation,
  CuratorActivity,
  ExpertActivity,
} = require("../models");

const getTeacherRating = async (req, res) => {
  const { teacherId } = req.params;

  if (!teacherId) {
    return res.status(400).json({ error: "Не указан teacherId" });
  }

  try {
    const now = new Date();
    const from3Years = new Date(now.getFullYear() - 3, 0, 1);

    const [publications, grants, curator, expert] = await Promise.all([
      ScientificPublication.count({
        where: {
          teacherId,
          createdAt: { [Op.gte]: from3Years },
        },
      }),
      GrantParticipation.count({
        where: {
          teacherId,
          createdAt: { [Op.gte]: from3Years },
        },
      }),
      CuratorActivity.count({
        where: {
          teacherId,
          createdAt: { [Op.gte]: from3Years },
        },
      }),
      ExpertActivity.count({
        where: {
          teacherId,
          createdAt: { [Op.gte]: from3Years },
        },
      }),
    ]);

    let score = 0;
    if (publications > 0) score += 25;
    if (grants > 0) score += 25;
    if (curator > 0) score += 25;
    if (expert > 0) score += 25;

    console.log(`📊 Rating calculated for ${teacherId}:`, {
      publications,
      grants,
      curator,
      expert,
      score,
    });

    res.json({ rating: score });
  } catch (error) {
    console.error("❌ Ошибка при вычислении рейтинга:", error.message || error);
    res.status(500).json({ error: "Ошибка при расчёте рейтинга" });
  }
};

module.exports = {
  getTeacherRating,
};
