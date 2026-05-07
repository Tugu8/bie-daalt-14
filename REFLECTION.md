# Эргэцүүлэл — Бие даалт 14

## 1. Аль assertion хамгийн их үнэ цэнэтэй санагдсан вэ?

Chain дээр суурилсан assertion хамгийн их үнэ цэнэтэй санагдсан. `Create Task` request-д `pm.environment.set("taskId", d.id)` ашиглан дараагийн `Update Task` болон `Delete Task` request-д автоматаар taskId дамжуулах нь реал ертөнцийн ашиглалтыг тусгасан. Нэг request-ийн гаралт нөгөөгийнхөд оролт болдог энэ зарчим нь integration testing-ийн гол давуу тал юм.

## 2. Negative test жишээ

`GET /api/tasks/999999` — байхгүй ID-тай task хайх request. Энэ тест нь API 404 status буцааж, `error` field агуулсан JSON хариу өгч байгааг баталгаажуулдаг. Энэ нь серверийн алдааны зам зөв тодорхойлогдсон эсэхийг шалгана — зөвхөн амжилттай тохиолдлыг шалгах нь хангалтгүй, алдааны зам ч бас contract юм.

## 3. Postman дотор ажилласан тест Newman-д fail болсон уу?

Анх collection runner дотор "Empty request URL" алдаа гарсан. Шалтгаан нь request-уудыг хадгалаагүй байсан — Postman-д draft байдлаар байсан request-ууд Newman-д хүрдэггүй. Request бүрийг Ctrl+S-ээр хадгалсны дараа бүх тест амжилттай болсон.

## 4. Token болон secret зохицуулалт

Энэ API auth шаардахгүй тул token байхгүй. Гэсэн ч environment variable-ийн соёлыг дагасан: `baseUrl`-г environment-д хадгалж, collection дотор hardcode хийгээгүй. Token шаардсан API сонгосон бол `env.dev.json`-д `REPLACE_THIS_TOKEN` placeholder ашиглаж, `.gitignore`-д оруулах байсан.

## 5. API өөрчлөгдвөл аль хэсэг хамгийн их эвдрэх вэ?

Response schema-г шалгадаг assertion-ууд хамгийн эмзэг. Жишээ нь `data.title` гэдэг field нэр `data.name` болж өөрчлөгдвөл олон тест нэгэн зэрэг fail болно. Үүнийг бууруулахын тулд JSON Schema validation (Ajv эсвэл `pm.response.to.have.jsonSchema()`) ашиглах нь зохистой — schema өөрчлөгдвөл яг аль field хаана эвдэрснийг тодорхой харуулдаг.
