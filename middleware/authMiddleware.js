const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("🔒 Нет токена или неправильный формат");
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Проверка токена пройдена:", decoded);
    next();
  } catch (err) {
    console.error("❌ Ошибка токена:", err.message);
    return res.status(403).json({ message: 'Неверный или просроченный токен' });
  }
};

module.exports = { authenticateToken }; // ✅ исправлено
