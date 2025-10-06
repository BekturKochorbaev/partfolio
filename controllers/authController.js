const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Функция для генерации токена JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Имя и фамилия обязательны" });
    }
    
    // Проверка, существует ли уже пользователь с таким email
    const exist = await User.findOne({ where: { email } });
    if (exist)
      return res.status(400).json({ message: 'Email уже существует' });

    // Хеширование пароля перед сохранением в базу данных
    const hashed = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: 'teacher'
    });
    

    // Генерация токена после успешной регистрации
    const token = generateToken(user.id, user.role);


    // Ответ с токеном и минимальной информацией о пользователе
res.json({
  token,
  user: {
    id: user.id,
    email: user.email,
    role: user.role, // ✅ добавили роль
  },
});


  } catch (err) {
    res.status(500).json({ message: 'Ошибка регистрации', error: err });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка существования пользователя с таким email
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    // Сравнение введённого пароля с захешированным паролем
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    // Генерация токена
    const token = generateToken(user.id, user.role);


    // Ответ с токеном и информацией о пользователе
  res.json({
  token,
  user: {
    id: user.id,
    email: user.email,
    role: user.role, // ✅ добавили роль
  },
});

  } catch (err) {
    res.status(500).json({ message: 'Ошибка входа', error: err });
  }
};
