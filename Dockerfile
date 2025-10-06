# Используем официальный Node.js образ
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json (и lock, если есть)
COPY package.json ./
COPY package-lock.json* ./

# Устанавливаем все зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Пробрасываем порт
EXPOSE 5000

# Команда запуска
CMD ["npm", "start"]
