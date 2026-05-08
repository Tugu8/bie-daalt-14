# Part A — Setup

## Сонгосон API
**Personal Task Tracker API** (Хувилбар 3 — Өөрийн Express сервер)

Node.js 18 + Express + SQLite дээр суурилсан бие даасан REST API. Task удирдлага, label систем, статистик endpoint-уудтай.

---

## Хувилбар 3-ын шаардлага хангасан байдал

| Шаардлага | Хэрэгжилт |
|-----------|-----------|
| ≥ 4 endpoint | ✅ Нийт 7 endpoint |
| POST/PUT/DELETE байх | ✅ Гурвуулаа бий |
| Body validation → 400 буцаах | ✅ `title` хоосон бол 400, буруу `priority`/`status` утга бол 400 |
| Not found → 404 буцаах | ✅ Байхгүй ID хайвал 404 |

---

## API тайлбар

### Tasks

| Method | Path | Юу хийдэг |
|--------|------|-----------|
| GET | `/api/tasks` | Бүх task жагсаалт. `search`, `priority`, `status`, `label` filter боломжтой |
| GET | `/api/tasks/:id` | ID-аар нэг task авна. Олдохгүй бол **404** |
| POST | `/api/tasks` | Шинэ task үүсгэнэ. `title` заавал байх — хоосон бол **400** |
| PUT | `/api/tasks/:id` | Task засах. Буруу `priority`/`status` утга бол **400** |
| DELETE | `/api/tasks/:id` | Task устгах. Олдохгүй бол **404** |

### Labels

| Method | Path | Юу хийдэг |
|--------|------|-----------|
| GET | `/api/labels` | Бүх label жагсаалт |
| POST | `/api/labels` | Шинэ label үүсгэнэ |

### Stats

| Method | Path | Юу хийдэг |
|--------|------|-----------|
| GET | `/api/stats` | Нийт task тоо, status-аар ангилсан статистик |

---

## Validation дүрэм

```
title       → string, хоосон биш, 255 тэмдэгтэд хүртэл (заавал)
priority    → "high" | "medium" | "low"
status      → "pending" | "done"
due_date    → "YYYY-MM-DD" формат
```

Дүрэм зөрчвөл → `400 Bad Request` + `{ "error": "..." }`

---

## Response бүтэц

```json
{ "data": { ... }, "meta": { ... } }   ← амжилттай
{ "error": "Task not found" }           ← алдаа
```

---

## Base URL
```
http://localhost:3000
```

## Authentication
Auth шаардахгүй — нээлттэй API.

## Postman Setup
- Workspace: F.CSM311 — Lab14
- Collection: Tugu — Task Tracker API
- Active environment: dev
- Хувьсагч: `{{baseUrl}}` = `http://localhost:3000`
