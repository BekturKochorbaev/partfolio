# Используем официальный Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем остальной код проекта
COPY . .

# Пробрасываем порт
EXPOSE 5000

# Указываем команду запуска
CMD ["npm", "start"]
