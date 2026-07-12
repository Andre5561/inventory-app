# Inventory App

SPA для управления приходами, группами и продуктами.

## Стек

- Next.js 16 + TypeScript
- Redux Toolkit
- Express.js REST API
- Socket.IO
- Framer Motion
- CSS Modules + BEM-подход
- Docker Compose

## Функционал

- Просмотр приходов, продуктов, групп и пользователей
- Добавление и удаление приходов
- Добавление и удаление продуктов
- Подтверждение удаления в модальном окне
- Фильтрация продуктов по типу
- Глобальный поиск по приходам, продуктам и пользователям
- Настройки с сохранением в `localStorage`
- Отображение количества активных сессий через Socket.IO
- Анимации переходов между страницами
- Адаптивный интерфейс

## Запуск локально

### Backend

```bash
cd backend
npm install
node server.js

Backend будет доступен на:

http://localhost:4000
Frontend
cd frontend
npm install
npm run dev

Приложение будет доступно на:

http://localhost:3000/orders
Запуск через Docker
docker compose up --build

После запуска откройте:

http://localhost:3000/orders

Для остановки контейнеров:

docker compose down
Структура проекта
inventory-app/
├── backend/             # Express REST API и Socket.IO
├── frontend/
│   └── src/
│       ├── app/         # Страницы Next.js
│       ├── components/  # Переиспользуемые компоненты
│       └── store/       # Redux Toolkit
└── docker-compose.yml
