# Part A — Setup

## Selected API
**Personal Task Tracker API** (Бие даалт 11 — Хувилбар 2)

## Brief
Node.js + Express + SQLite дээр суурилсан REST API. Task CRUD, label удирдлага, статистик endpoint-уудтай.

## Base URL
```
http://localhost:3000
```

## Authentication
Auth шаардахгүй — нээлттэй API.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | Бүх task жагсаалт |
| GET | /api/tasks/:id | Нэг task |
| POST | /api/tasks | Шинэ task үүсгэх |
| PUT | /api/tasks/:id | Task засах |
| DELETE | /api/tasks/:id | Task устгах |
| GET | /api/labels | Бүх label |
| GET | /api/stats | Статистик |

## Postman Setup
- Workspace: F.CSM311 — Lab14
- Collection: Tugu — Task Tracker API
- Active environment: dev
- Use `{{baseUrl}}` variable in all requests
