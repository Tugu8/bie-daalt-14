# Бие даалт 14 — API Testing with Postman + Newman

**Хувилбар 3** — Өөрийн Express сервер (Personal Task Tracker API)
**Оюутан:** Tugu8
**Хичээл:** F.CSM311 — Программ хангамжийн бүтээлт

---

## Товч тайлбар

Node.js + Express + SQLite дээр суурилсан Personal Task Tracker REST API-г Postman ашиглан тестэлсэн. Newman CLI-аар командын мөрнөөс ажиллуулж, GitHub Actions-д CI pipeline холбосон.

---

## Repository бүтэц

```
bie-daalt-14/
├── README.md                        # Энэ файл
├── REFLECTION.md                    # 5 асуултын хариу
├── partA/
│   ├── SETUP.md                     # API тайлбар, base URL, auth
│   └── Screenshot.png               # Эхний амжилттай GET request
├── postman/
│   ├── collection.json              # 8 request, folder-аар бүлэглэсэн
│   ├── env.dev.json                 # Dev environment
│   └── env.ci.json                  # CI environment
├── .github/
│   └── workflows/
│       └── api-tests.yml            # GitHub Actions CI
├── reports/
│   └── api.html                     # Newman HTML report
└── server/
    ├── package.json
    └── src/
        ├── index.js
        ├── app.js
        ├── db/database.js
        ├── routes/
        ├── services/
        └── repositories/
```

---

## Хэрэгсэл

- [Postman](https://www.postman.com/downloads/) — Desktop app
- Node.js 18+
- Newman CLI

---

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

---

## Environment хувьсагч

| Variable | Dev утга | Тайлбар |
|----------|----------|---------|
| `baseUrl` | `http://localhost:3000` | Серверийн хаяг |
| `taskId` | _(автомат)_ | Create Task-аас chain-ээр авна |
| `testTitle` | _(автомат)_ | Pre-request script-аар үүсгэнэ |

---

## Collection бүтэц — 8 Request

### Tasks Folder

---

#### 1. Get All Tasks
**Method:** `GET`
**URL:** `{{baseUrl}}/api/tasks`
**Тайлбар:** Бүх task-уудын жагсаалтыг авна

**Response (200 OK):**
```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

**Test assertions (4):**
```js
pm.test("Status 200", () => { pm.response.to.have.status(200); });
pm.test("Response < 1s", () => { pm.expect(pm.response.responseTime).to.be.below(1000); });
pm.test("Has data array", () => {
  pm.expect(pm.response.json()).to.have.property("data");
  pm.expect(pm.response.json().data).to.be.an("array");
});
pm.test("Content-Type JSON", () => { pm.response.to.have.header("Content-Type"); });
```

---

#### 2. Get Task By ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/tasks/1`
**Тайлбар:** ID-аар нэг task хайна. DB хоосон үед 404 буцаана

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Test assertions (2):**
```js
pm.test("Status 200 or 404", () => {
  pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});
pm.test("Response < 1s", () => { pm.expect(pm.response.responseTime).to.be.below(1000); });
```

---

#### 3. Create Task
**Method:** `POST`
**URL:** `{{baseUrl}}/api/tasks`
**Тайлбар:** Шинэ task үүсгэнэ. Pre-request script-аар `testTitle` автоматаар үүсгэж, response-оос `taskId`-г environment-д хадгална (chain)

**Pre-request script:**
```js
pm.environment.set("testTitle", "Test Task " + Date.now());
```

**Body (raw JSON):**
```json
{
  "title": "{{testTitle}}",
  "priority": "high"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 1,
    "title": "Test Task 1746494012345",
    "priority": "high"
  }
}
```

**Test assertions (3):**
```js
pm.test("Status 201", () => { pm.response.to.have.status(201); });
pm.test("Returns id", () => {
  const d = pm.response.json().data;
  pm.expect(d).to.have.property("id");
  pm.expect(d.id).to.be.a("number");
  pm.environment.set("taskId", d.id);
});
pm.test("Title matches", () => {
  pm.expect(pm.response.json().data.title).to.include("Test Task");
});
```

---

#### 4. Update Task
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/tasks/{{taskId}}`
**Тайлбар:** Create Task-аас авсан `{{taskId}}`-г ашиглан task-ыг засна

**Body (raw JSON):**
```json
{
  "title": "Updated Task",
  "status": "done"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "title": "Updated Task",
    "status": "done",
    "priority": "high",
    "updated_at": "2026-05-06 01:14:03"
  }
}
```

**Test assertions (2):**
```js
pm.test("Status 200", () => { pm.response.to.have.status(200); });
pm.test("Title updated", () => {
  pm.expect(pm.response.json().data.title).to.equal("Updated Task");
});
```

---

#### 5. Delete Task
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/tasks/{{taskId}}`
**Тайлбар:** `{{taskId}}`-тай task-ыг устгана

**Response (200 OK):**
```json
{
  "data": null,
  "meta": {
    "message": "Task deleted"
  }
}
```

**Test assertions (2):**
```js
pm.test("Status 200 or 204", () => {
  pm.expect(pm.response.code).to.be.oneOf([200, 204]);
});
pm.test("Response < 1s", () => { pm.expect(pm.response.responseTime).to.be.below(1000); });
```

---

#### 6. Task Not Found (Negative test)
**Method:** `GET`
**URL:** `{{baseUrl}}/api/tasks/999999`
**Тайлбар:** Байхгүй ID явуулж 404 хариу авна — алдааны замыг шалгах

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Test assertions (2):**
```js
pm.test("Status 404", () => { pm.response.to.have.status(404); });
pm.test("Has error field", () => {
  pm.expect(pm.response.json()).to.have.property("error");
});
```

---

### Labels Folder

#### 7. Get All Labels
**Method:** `GET`
**URL:** `{{baseUrl}}/api/labels`
**Тайлбар:** Бүх label жагсаалт

**Test assertions (2):**
```js
pm.test("Status 200", () => { pm.response.to.have.status(200); });
pm.test("Data is array", () => {
  pm.expect(pm.response.json().data).to.be.an("array");
});
```

---

### Stats Folder

#### 8. Get Stats
**Method:** `GET`
**URL:** `{{baseUrl}}/api/stats`
**Тайлбар:** Task-уудын статистик мэдээлэл

**Test assertions (3):**
```js
pm.test("Status 200", () => { pm.response.to.have.status(200); });
pm.test("Has data property", () => {
  pm.expect(pm.response.json()).to.have.property("data");
});
pm.test("Response < 1s", () => { pm.expect(pm.response.responseTime).to.be.below(1000); });
```

---

## Newman үр дүн

```
requests:          8  /  0 failed
test-scripts:      8  /  0 failed
prerequest-scripts: 1  /  0 failed
assertions:       21  /  0 failed

total run duration: 1076ms
average response time: 38ms
```

---

## GitHub Actions CI

Push хийх бүрт автоматаар Newman ажиллана. Workflow файл: `.github/workflows/api-tests.yml`

- Сервер эхлүүлнэ
- Newman тест ажиллуулна
- HTML report артефакт болж хадгална
