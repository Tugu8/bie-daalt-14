# Бие даалт 14 — API Testing with Postman + Newman

Personal Task Tracker API-ийн Postman collection болон Newman CI тохиргоо.

## Хэрэгсэл

- [Postman](https://www.postman.com/downloads/)
- Node.js 18+
- Newman

## Ажиллуулах заавар

### 1. API серверийг эхлүүлэх

```bash
cd server
npm install
npm start
```

Сервер `http://localhost:3000` дээр ажиллана.

### 2. Newman суулгах

```bash
npm install -g newman newman-reporter-htmlextra
```

### 3. Тест ажиллуулах

```bash
newman run postman/collection.json -e postman/env.dev.json
```

### 4. HTML report үүсгэх

```bash
newman run postman/collection.json \
  -e postman/env.dev.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/api.html
```

## Collection бүтэц

| Folder | Requests |
|--------|----------|
| Tasks | Get All Tasks, Get Task By ID, Create Task, Update Task, Delete Task, Task Not Found |
| Labels | Get All Labels |
| Stats | Get Stats |

## Environment хувьсагч

| Variable | Dev утга |
|----------|----------|
| baseUrl | http://localhost:3000 |
| taskId | (chain-ээр автоматаар тохируулагдана) |
| testTitle | (pre-request script-аар тохируулагдана) |
