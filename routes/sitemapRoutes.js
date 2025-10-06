const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const teachers = await User.findAll({ where: { role: "teacher" } });

    const urls = teachers.map((t) => {
      return `
  <url>
    <loc>https://teacher-portfolio.mnu.kg/teachers/${t.id}</loc>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://teacher-portfolio.mnu.kg/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://teacher-portfolio.mnu.kg/search</loc>
  </url>
  ${urls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Ошибка при генерации sitemap:", err);
    res.status(500).send("Ошибка генерации sitemap");
  }
  
});

module.exports = router;
