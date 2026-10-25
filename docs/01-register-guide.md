# TỔNG HỢP TOÀN BỘ QUY TRÌNH XÂY DỰNG TÍNH NĂNG ĐĂNG KÝ (REGISTER)

> **Mục tiêu cẩm nang:** Cung cấp tài liệu đào tạo chuyên sâu từ Senior Tech Lead & Mentor, giúp Junior Developer nắm trọn vẹn bản chất kiến trúc, giải phẫu từng câu lệnh Terminal, ánh xạ chính xác sự tiến hóa của thư mục dự án và hiểu thấu đáo tư duy logic kỹ thuật để có thể tự tay code lại toàn bộ từ đầu mà không cần copy-paste.

---

<a id="mục-lục"></a>
## 📌 Mục lục (Table of Contents)

- [📋 Bảng tóm tắt lộ trình thực hiện từ đầu](#bảng-tóm-tắt-lộ-trình-thực-hiện-từ-đầu)
- [1. Sơ đồ luồng dữ liệu tổng quan](#1-sơ-đồ-luồng-dữ-liệu-tổng-quan)
  - [1.1. Sơ đồ kiến trúc phân tầng (Architecture Flow)](#11-sơ-đồ-kiến-trúc-phân-tầng-architecture-flow)
  - [1.2. Sơ đồ chi tiết vòng đời xử lý Request - Response (Sequence Lifecycle)](#12-sơ-đồ-chi-tiết-vòng-đời-xử-lý-request---response-sequence-lifecycle)
- [2. Giai đoạn 1: Thiết lập hạ tầng & Dự án (Setup)](#2-giai-đoạn-1-thiết-lập-hạ-tầng--dự-án-setup)
  - [Bước 1.1: Khởi tạo hạ tầng Cơ sở dữ liệu với Docker Compose](#bước-11-khởi-tạo-hạ-tầng-cơ-sở-dữ-liệu-với-docker-compose)
  - [Bước 1.2: Khởi tạo thư mục và dự án Backend Node.js](#bước-12-khởi-tạo-thư-mục-và-dự-án-backend-nodejs)
  - [Bước 1.3: Cấu hình biến môi trường (backend/.env & backend/.env.example)](#bước-13-cấu-hình-biến-môi-trường-backendenv--backendenvexample)
  - [Bước 1.4: Thiết kế lược đồ Cơ sở dữ liệu với Prisma (Schema Design)](#bước-14-thiết-kế-lược-đồ-cơ-sở-dữ-liệu-với-prisma-schema-design)
  - [Bước 1.5: Khởi tạo Database Client Singleton](#bước-15-khởi-tạo-database-client-singleton)
- [3. Giai đoạn 2: Xây dựng tính năng theo 3 tầng kiến trúc (Service, Controller, Routes)](#3-giai-đoạn-2-xây-dựng-tính-năng-theo-3-tầng-kiến-trúc-service-controller-routes)
  - [Bước 2.1: Tầng Service (backend/src/services/auth.service.js) - Xử lý nghiệp vụ lõi](#bước-21-tầng-service-backendsrcservicesauthservicejs---xử-lý-nghiệp-vụ-lõi)
  - [Bước 2.2: Tầng Controller (backend/src/controllers/auth.controller.js) - Xử lý HTTP Request/Response](#bước-22-tầng-controller-backendsrccontrollersauthcontrollerjs---xử-lý-http-requestresponse)
  - [Bước 2.3: Tầng Routes & Express Server - Mở cổng kết nối mạng](#bước-23-tầng-routes--express-server---mở-cổng-kết-nối-mạng)
- [4. Giai đoạn 3: Kiểm thử toàn diện với Postman (Bảng Test Cases)](#4-giai-đoạn-3-kiểm-thử-toàn-diện-với-postman-bảng-test-cases)
  - [Lệnh chạy khởi động hệ thống Backend](#lệnh-chạy-khởi-động-hệ-thống-backend)
  - [Bảng 5 Kịch bản Kiểm thử chi tiết (Test Cases Checklist)](#bảng-5-kịch-bản-kiểm-thử-chi-tiết-test-cases-checklist)
- [5. Sổ tay lỗi kinh điển cần tránh (Lessons Learned)](#5-sổ-tay-lỗi-kinh-điển-cần-tránh-lessons-learned)

---

<a id="bảng-tóm-tắt-lộ-trình-thực-hiện-từ-đầu"></a>
## 📋 Bảng tóm tắt lộ trình thực hiện từ đầu (Step-by-Step Roadmap)

Bảng tổng hợp lộ trình 3 giai đoạn giúp lập trình viên bao quát toàn bộ tiến trình, tra cứu nhanh mã Sub-ID và đối chiếu kết quả đầu ra khi tự code lại từ đầu:

| Giai đoạn | Bước | Mã định danh (Sub-ID) | Tập tin / Thao tác | Nhiệm vụ cốt lõi | Kết quả đầu ra (Deliverable) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Giai đoạn 1: Hạ tầng & Setup** | **Bước 1.1** | `[01-docker-compose:service-postgres]`<br>`[01-docker-compose:named-volumes]` | `docker-compose.yml`<br>`docker compose up -d` | Đóng gói và chạy cơ sở dữ liệu PostgreSQL trong container cô lập | Container `fullstack_postgres` chạy ngầm, mở cổng TCP 5432 và lưu trữ vào Volume `postgres_data` |
| | **Bước 1.2** | `[01-package:init]` | `backend/package.json`<br>`npm init -y`<br>`npm install ...` | Khởi tạo dự án Node.js ES Modules (`"type": "module"`) và cài đặt Express, Prisma, Bcryptjs, CORS, Dotenv | Thư mục `backend/node_modules/` và `package.json` với đầy đủ thư viện phụ thuộc |
| | **Bước 1.3** | `[01-env:server-port]`<br>`[01-env:database-url]` | `backend/.env`<br>`backend/.env.example` | Cấu hình cổng mạng HTTP (5000) và chuỗi Connection URI kết nối Database chuẩn RFC 3986 | `process.env.PORT` và `process.env.DATABASE_URL` sẵn sàng cho hệ thống tiêu thụ |
| | **Bước 1.4** | `[01-contract:model-user]` | `backend/src/prisma/contract.prisma`<br>`npx prisma contract emit` | Thiết kế Data Contract lược đồ thực thể `User` bằng ngôn ngữ PSL chuẩn Prisma v8 | Tự động sinh `contract.json`, `contract.d.ts` và bảng `User` trong PostgreSQL |
| | **Bước 1.5** | `[01-db:singleton]` | `backend/src/prisma/db.ts` | Khởi tạo thể hiện duy nhất (Singleton Pattern) của Prisma Client quản lý Connection Pool | Module `db` export singleton sẵn sàng cho toàn bộ backend import truy vấn |
| **Giai đoạn 2: Xây dựng 3 tầng Code** | **Bước 2.1** | `[01-auth-service:register]` | `backend/src/services/auth.service.js` | Viết logic nghiệp vụ lõi: Kiểm tra trùng email, băm mật khẩu Bcrypt (10 rounds) và lưu DB | Hàm `registerUserService()` trả về object User an toàn (đã loại bỏ password) |
| | **Bước 2.2** | `[01-auth-controller:register]` | `backend/src/controllers/auth.controller.js` | Tiếp nhận HTTP Request, áp dụng Guard Clauses (Validate email/password) và ánh xạ mã lỗi (201, 400, 409, 500) | Hàm `registerController()` phản hồi JSON chuẩn RESTful API cho Client |
| | **Bước 2.3A** | `[01-auth-routes:register]` | `backend/src/routes/auth.routes.js` | Tạo Router nhánh độc lập và ánh xạ phương thức HTTP POST `/register` tới Controller | Thực thể `router` của Express sẵn sàng nạp vào file ứng dụng trung tâm |
| | **Bước 2.3B** | `[01-app:init]`<br>`[01-app:middlewares]`<br>`[01-app:routes]` | `backend/src/app.js` | Cấu hình trung tâm ứng dụng Express: CORS, Body Parser `express.json()` và gắn tiền tố `/api/auth` | Thực thể `app` hoàn chỉnh đường ống Middleware & bảng định tuyến |
| | **Bước 2.3C** | `[01-server:bootstrap]`<br>`[01-server:listen]` | `backend/src/server.js` | Nạp biến môi trường ở dòng đầu và kích hoạt máy chủ HTTP lắng nghe kết nối tại cổng 5000 | Server hoạt động tại `http://localhost:5000`, in thông báo sẵn sàng nhận request |
| **Giai đoạn 3: Kiểm thử Postman** | **Bước 3.1** | `[01-verify:run-server]` | `node src/server.js` | Kích hoạt hệ sinh thái: Khởi động container Postgres và chạy ứng dụng Backend Node.js | Terminal thông báo Server kết nối thành công |
| | **Bước 3.2** | `[01-verify:test-cases]` | Postman / Thunder Client | Kiểm thử 5 kịch bản: Thành công (201), Thiếu email (400), Thiếu pass (400), Pass ngắn (400), Trùng email (409) | Toàn bộ 5/5 test cases đều trả về mã HTTP và payload chính xác 100% |

---

<a id="1-sơ-đồ-luồng-dữ-liệu-tổng-quan"></a>
## 1. Sơ đồ luồng dữ liệu tổng quan

Mô hình dữ liệu di chuyển theo kiến trúc phân tầng một chiều (Unidirectional Layered Architecture), đảm bảo triệt để nguyên tắc đơn trách nhiệm (Single Responsibility Principle):

<a id="11-sơ-đồ-kiến-trúc-phân-tầng-architecture-flow"></a>
### 1.1. Sơ đồ kiến trúc phân tầng (Architecture Flow)

```text
[Client / Postman]
       │
       ▼ (1) HTTP POST http://localhost:5000/api/auth/register (Headers + Body JSON)
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [TẦNG 1: CỔNG VÀO & MÁY CHỦ] (Server & Application Layer)                        │
│  • server.js ──> Khởi tạo hạ tầng mạng, lắng nghe cổng PORT (5000)               │
│  • app.js    ──> Middleware cors() mở quyền truy cập, express.json() parse Body  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼ (2) Chuyển tiếp Request đã giải mã
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [TẦNG 2: ĐIỀU HƯỚNG] (Routing Layer)                                             │
│  • auth.routes.js ──> Tiếp nhận tiền tố "/api/auth", điều phối URL "/register"   │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼ (3) Ủy thác xử lý cho Controller
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [TẦNG 3: ĐIỀU KHIỂN & BẢO VỆ] (Controller Layer)                                 │
│  • auth.controller.js:                                                           │
│    - Validate dữ liệu đầu vào (Guard Clauses: email, password >= 6 ký tự)        │
│    - Gọi Service thực thi nghiệp vụ đăng ký                                      │
│    - Bắt lỗi ngoại lệ và phản hồi mã HTTP (201 Created, 400, 409, 500)           │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼ (4) registerUserService({ email, password, name })
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [TẦNG 4: NGHIỆP VỤ LÕI] (Service Layer)                                          │
│  • auth.service.js:                                                              │
│    - Kiểm tra email đã tồn tại trong DB chưa                                     │
│    - Sinh Salt ngẫu nhiên và băm mật khẩu bằng Bcrypt (10 rounds)                │
│    - Lưu bản ghi mới vào PostgreSQL qua Prisma ORM                               │
│    - Loại bỏ hash password an toàn: { password: _, ...userSafe }                 │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼ (5) db.orm.public.User.create(...)
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [TẦNG 5: TRUY XUẤT CƠ SỞ DỮ LIỆU] (Database & Infrastructure Layer)              │
│  • db.ts                   ──> Database Client Singleton duy trì Connection Pool │
│  • (Docker) PostgreSQL 16  ──> Bảng "User" lưu trữ dữ liệu bền vững (Volume)     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

<a id="12-sơ-đồ-chi-tiết-vòng-đời-xử-lý-request---response-sequence-lifecycle"></a>
### 1.2. Sơ đồ chi tiết vòng đời xử lý Request - Response (Sequence Lifecycle)

```text
[Client / Postman]
       │
       │ (1) POST /api/auth/register { email, password, name }
       ▼
[server.js & app.js]
       │ ──> cors() kiểm tra nguồn gốc CORS
       │ ──> express.json() phân giải dòng byte thô thành req.body
       ▼
[auth.routes.js]
       │ ──> Nhận diện đường dẫn: /api/auth + /register
       │ ──> Điều hướng tới registerController
       ▼
[auth.controller.js]
       │
       ├──> [Kiểm tra 1]: Thiếu email hoặc password?
       │        ├──> ĐÚNG ──> Phản hồi HTTP 400 Bad Request ("Email và password là bắt buộc") ──> [Client]
       │
       ├──> [Kiểm tra 2]: password.length < 6?
       │        ├──> ĐÚNG ──> Phản hồi HTTP 400 Bad Request ("Mật khẩu tối thiểu 6 ký tự")   ──> [Client]
       │
       └──> HỢP LỆ: Chuyển dữ liệu xuống tầng Service
                │
                ▼
         [auth.service.js]
                │
                │ (2) Truy vấn kiểm tra email
                ▼
         [db.ts (Prisma ORM)] ──> SELECT * FROM "User" WHERE email = ? ──> [PostgreSQL 16]
                ▲
                │ (3) Trả về kết quả truy vấn
                │
         [auth.service.js]
                │
                ├──> [Kiểm tra 3]: Email đã tồn tại trong DB?
                │        │
                │        └──> ĐÚNG: throw new Error("EMAIL_ALREADY_EXISTS")
                │                   │
                │                   ▼
                │             [auth.controller.js] (Bắt lỗi trong catch)
                │                   │
                │                   └──> Phản hồi HTTP 409 Conflict ("email này đã được sử dụng") ──> [Client]
                │
                └──> KHÔNG TRÙNG (Email hợp lệ):
                         │
                         ├── 1. bcrypt.genSalt(10) & bcrypt.hash(password, salt)
                         ├── 2. db.orm.public.User.create({ email, password: hash, name }) ──> [PostgreSQL 16]
                         ├── 3. Nhận bản ghi newUser từ DB
                         ├── 4. Bóc tách an toàn: const { password: _, ...userSafe } = newUser
                         │
                         ▼ (4) Trả về userSafe cho Controller
                [auth.controller.js]
                         │
                         ▼ (5) Phản hồi HTTP 201 Created
                [Client / Postman] <── { message: "Đăng ký thành công", user: userSafe }
```

[⬆️ Quay lại Mục lục](#mục-lục)

---

<a id="2-giai-đoạn-1-thiết-lập-hạ-tầng--dự-án-setup"></a>
## 2. Giai đoạn 1: Thiết lập hạ tầng & Dự án (Setup)

<a id="bước-11-khởi-tạo-hạ-tầng-cơ-sở-dữ-liệu-với-docker-compose"></a>
### Bước 1.1: Khởi tạo hạ tầng Cơ sở dữ liệu với Docker Compose
- **Tập tin cấu hình:** `docker-compose.yml` (đặt tại thư mục gốc dự án `fullstack/`).
- **Hướng dẫn tư duy logic:** Thay vì cài đặt trực tiếp phần mềm PostgreSQL cồng kềnh lên hệ điều hành máy thật (dễ gây xung đột cổng, ô nhiễm registry và khó xóa sạch dữ liệu), ta dùng Docker Compose để đóng gói Database vào một Container độc lập. Khi muốn xóa toàn bộ dữ liệu để luyện code lại từ đầu, ta chỉ cần gõ 1 lệnh là có ngay cơ sở dữ liệu mới tinh.

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: fullstack_postgres
    restart: always
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: fullstack_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- **Lệnh Terminal cần thực thi:**
```bash
docker compose up -d
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `docker`: Gọi chương trình điều khiển chính của **Docker Engine**.
> - `compose`: Gọi plugin **Docker Compose** - công cụ chuyên đọc file kịch bản `docker-compose.yml` để thiết lập và chạy đồng loạt các container.
> - `up`: Chỉ thị kiểm tra image (tự động tải image `postgres:16-alpine` từ Docker Hub về nếu máy chưa có), khởi tạo mạng nội bộ (network), cấp phát ổ đĩa ảo (volume) và khởi động container.
> - `-d` (viết tắt của `--detach`): Chế độ chạy ngầm (detached mode), giúp container chạy nền và giải phóng cửa sổ terminal ngay lập tức để lập trình viên tiếp tục gõ các lệnh tiếp theo.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> fullstack/
> ├── 📄 docker-compose.yml
> └── 🐳 [MỚI TẠO chính xác từ lệnh docker compose up -d]:
>     ├── Container: "fullstack_postgres" (Đang chạy ngầm, mở cổng 5432 trên máy Host)
>     └── Volume: "postgres_data" (Phân vùng ổ đĩa ảo do Docker quản lý để lưu data DB bền vững)
> ```

---

<a id="bước-12-khởi-tạo-thư-mục-và-dự-án-backend-nodejs"></a>
### Bước 1.2: Khởi tạo thư mục và dự án Backend Node.js

#### A. Tạo thư mục làm việc:
- **Hướng dẫn tư duy logic:** Phân tách rõ ràng giữa mã nguồn máy chủ (Backend) và giao diện người dùng (Frontend) thành 2 thư mục riêng biệt để mỗi bên tự quản lý dependencies độc lập, tránh xung đột thư viện giữa môi trường Node.js và môi trường trình duyệt.

- **Lệnh Terminal cần thực thi:**
```bash
mkdir backend && cd backend
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `mkdir` (viết tắt của **make directory**): Lệnh của hệ điều hành để tạo một thư mục mới có tên là `backend`.
> - `&&` (toán tử logic **AND** trong Shell): Ghép nối hai lệnh; lệnh phía sau (`cd backend`) chỉ được chạy nếu lệnh phía trước (`mkdir backend`) thực thi thành công không có lỗi.
> - `cd` (viết tắt của **change directory**): Lệnh di chuyển con trỏ làm việc hiện tại của terminal vào bên trong thư mục `backend`.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> fullstack/
> ├── 📄 docker-compose.yml
> └── 📁 backend/                <-- [MỚI TẠO chính xác từ lệnh mkdir backend] Thư mục chứa toàn bộ mã nguồn Backend
> ```

---

#### B. Khởi tạo cấu hình dự án Node.js:
- **Hướng dẫn tư duy logic:** Mọi dự án Node.js đều bắt buộc phải có tập tin `package.json`. Tập tin này đóng vai trò như "chứng minh thư" của dự án, quản lý phiên bản, danh sách các thư viện cần cài đặt và các script khởi chạy.

- **Lệnh Terminal cần thực thi:**
```bash
npm init -y
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `npm`: **Node Package Manager** - trình quản lý thư viện và gói chính thức của nền tảng Node.js.
> - `init`: Lệnh khởi tạo một dự án Node.js mới và sinh ra tập tin `package.json`.
> - `-y` (viết tắt của `--yes`): Tự động điền giá trị mặc định cho toàn bộ các trường thông tin (package name, version, description, entry point...) mà không dừng lại hỏi người dùng bấm Enter từng dòng.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/
> └── 📄 package.json            <-- [MỚI TẠO chính xác từ lệnh npm init -y] Tập tin quản lý metadata và dependencies
> ```
> 📝 *Nội dung khởi tạo bên trong `package.json`:*
> ```json
> {
>   "name": "backend",
>   "version": "1.0.0",
>   "main": "index.js",
>   "scripts": { ... }
> }
> ```

---

#### C. Cài đặt các thư viện chạy chính (Runtime Dependencies):
- **Hướng dẫn tư duy logic:**
  - `express`: Framework tối giản xây dựng RESTful API chuẩn mực, xử lý HTTP request/response.
  - `cors`: Bật cơ chế chia sẻ tài nguyên giữa các nguồn khác nhau (Cross-Origin Resource Sharing), cho phép Frontend gọi API mà không bị trình duyệt chặn vì chính sách bảo mật Same-Origin.
  - `dotenv`: Tách biệt các biến môi trường nhạy cảm (Cổng Port, chuỗi kết nối DB) ra khỏi code nguồn theo tiêu chuẩn 12-Factor App.
  - `@prisma/client`: Database client tự động sinh mã, cung cấp các hàm truy vấn SQL an toàn (chống SQL Injection) và hỗ trợ gợi ý code thông minh.
  - `bcryptjs`: Thuật toán băm mật khẩu một chiều chậm (slow hashing algorithm), tạo chi phí tính toán cực lớn để ngăn chặn kẻ tấn công bẻ khóa mật khẩu bằng phương pháp brute-force.

- **Lệnh Terminal cần thực thi:**
```bash
npm install express cors dotenv @prisma/client bcryptjs
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `npm install`: Lệnh kết nối tới kho npm registry trên Internet, tải mã nguồn các gói về lưu tại máy và tự động ghi tên gói vào danh mục `"dependencies"` của file `package.json`.
> - `express`, `cors`, `dotenv`, `@prisma/client`, `bcryptjs`: Tên chính thức của 5 thư viện runtime cần cài đặt.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/
> ├── 📁 node_modules/           <-- [MỚI TẠO chính xác từ lệnh npm install express cors dotenv @prisma/client bcryptjs] Chứa thư viện vừa cài và toàn bộ dependencies phụ
> ├── 📄 package-lock.json       <-- [MỚI TẠO chính xác từ lệnh npm install express cors dotenv @prisma/client bcryptjs] Khóa cứng phiên bản và checksum để đảm bảo tính nhất quán
> └── 📄 package.json            <-- [CẬP NHẬT chính xác từ lệnh npm install express cors dotenv @prisma/client bcryptjs] Thêm khối "dependencies"
> ```
> 📝 *Đoạn mã vừa xuất hiện trong `package.json`:*
> ```json
> "dependencies": {
>   "@prisma/client": "^7.10.1",
>   "bcryptjs": "^3.0.3",
>   "cors": "^2.8.6",
>   "dotenv": "^18.0.9",
>   "express": "^5.3.0"
> }
> ```

---

#### D. Cài đặt các thư viện phát triển (Development Dependencies):
- **Hướng dẫn tư duy logic:** Phân loại rõ ràng giữa thư viện chỉ phục vụ quá trình lập trình của kỹ sư (Dev Dependencies) và thư viện máy chủ cần để chạy thực tế (Runtime Dependencies) để khi triển khai lên máy chủ thật (Production) không bị phình to dung lượng ổ cứng.
  - `prisma`: Bộ công cụ CLI để thao tác với database schema.
  - `nodemon`: Tiện ích tự động restart server mỗi khi bấm lưu file (`Ctrl + S`), giúp lập trình viên không mất thời gian tắt bật server thủ công.

- **Lệnh Terminal cần thực thi:**
```bash
npm install -D prisma nodemon
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `npm install`: Lệnh cài đặt gói.
> - `-D` (viết tắt của `--save-dev`): Cờ chỉ thị lưu thông tin các gói này vào mục `"devDependencies"` thay vì `"dependencies"`.
> - `prisma`: Công cụ dòng lệnh CLI của Prisma.
> - `nodemon`: Tiện ích lắng nghe thay đổi file mã nguồn.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/
> ├── 📁 node_modules/           <-- [CẬP NHẬT chính xác từ lệnh npm install -D prisma nodemon] Tải thêm mã nguồn prisma CLI và nodemon
> ├── 📄 package-lock.json       <-- [CẬP NHẬT chính xác từ lệnh npm install -D prisma nodemon] Ghi nhận thêm cây phụ thuộc mới
> └── 📄 package.json            <-- [CẬP NHẬT chính xác từ lệnh npm install -D prisma nodemon] Thêm khối "devDependencies"
> ```
> 📝 *Đoạn mã vừa xuất hiện trong `package.json`:*
> ```json
> "devDependencies": {
>   "nodemon": "^3.1.14",
>   "prisma": "^8.0.0-rc.26"
> }
> ```

---

#### E. Tinh chỉnh cấu hình `backend/package.json`:
- **Hướng dẫn tư duy logic:**
  - Khai báo `"type": "module"` để Node.js hiểu và cho phép sử dụng chuẩn cú pháp ES Modules hiện đại (`import / export`), loại bỏ hoàn toàn chuẩn CommonJS cũ kỹ (`require`).
  - Thêm script `"dev": "nodemon src/server.js"` giúp khởi động server qua nodemon bằng câu lệnh ngắn gọn `npm run dev`.

> 📝 *Hình ảnh hoàn chỉnh của file `backend/package.json`:*
> ```json
> {
>   "name": "backend",
>   "version": "1.0.0",
>   "type": "module",
>   "scripts": {
>     "dev": "nodemon src/server.js"
>   },
>   "dependencies": {
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "cors": "^2.8.6",
>     "dotenv": "^18.0.9",
>     "express": "^5.3.0"
>   },
>   "devDependencies": {
>     "nodemon": "^3.1.14",
>     "prisma": "^8.0.0-rc.26"
>   }
> }
> ```

---

<a id="bước-13-cấu-hình-biến-môi-trường-backendenv--backendenvexample"></a>
### Bước 1.3: Cấu hình biến môi trường (`backend/.env` & `backend/.env.example`)
- **Tập tin:** `backend/.env`
- **Hướng dẫn tư duy logic:** Tuyệt đối không bao giờ hardcode mật khẩu Database hay cổng Port vào code JavaScript. File `.env` sẽ nằm trong `.gitignore` để không bị commit lên GitHub, bảo vệ an toàn thông tin đăng nhập của hệ thống. Đồng thời tạo file `.env.example` làm mẫu cấu hình cho các thành viên trong đội ngũ.

```env
PORT=5000
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/fullstack_db?schema=public"
```

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/
> ├── 📄 .env                    <-- [MỚI TẠO BẰNG TAY] Chứa chuỗi kết nối Database PostgreSQL và cấu hình Port thực tế
> ├── 📄 .env.example            <-- [MỚI TẠO BẰNG TAY] Tệp mẫu đẩy lên Git để người khác biết cách cấu hình biến
> ├── 📁 node_modules/
> ├── 📄 package-lock.json
> └── 📄 package.json
> ```

---

<a id="bước-14-thiết-kế-lược-đồ-cơ-sở-dữ-liệu-với-prisma-schema-design"></a>
### Bước 1.4: Thiết kế lược đồ Cơ sở dữ liệu với Prisma (Schema Design)
- **Tập tin:** `backend/src/prisma/contract.prisma`
- **Hướng dẫn tư duy logic:**
  - `// use prisma-8`: Bắt buộc nằm ở dòng 1 để kích hoạt engine Prisma v8.
  - `email String @unique`: Tạo ràng buộc duy nhất (Unique Constraint) ngay tại tầng Database. Điều này đảm bảo tính toàn vẹn dữ liệu, ngăn ngừa triệt để lỗi đăng ký trùng email ngay cả khi có 2 request gửi lên cùng một phần nghìn giây (Race condition).
  - `password String`: Trường lưu trữ chuỗi hash mật khẩu (tuyệt đối không để null).

```prisma
// use prisma-8
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt TimestamptzString @default(now())
  updatedAt temporal.updatedAtString()
}
```

- **Lệnh Terminal cần thực thi để đồng bộ:**
```bash
npx prisma contract emit
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `npx` (viết tắt của **Node Package Execute**): Công cụ của npm cho phép chạy trực tiếp các lệnh CLI nằm trong `node_modules` mà không cần cài đặt global ra toàn máy.
> - `prisma`: Gọi chương trình dòng lệnh của Prisma.
> - `contract`: Nhóm lệnh quản lý hợp đồng dữ liệu trong Prisma ORM v8.
> - `emit`: Đọc cú pháp PSL trong `contract.prisma` và biên dịch ra file JSON metadata cùng các file định nghĩa kiểu TypeScript.

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/src/
> └── 📁 prisma/
>     ├── 📄 contract.prisma     (File bạn viết: Định nghĩa Model User)
>     ├── 📄 contract.json       <-- [MỚI TẠO chính xác từ lệnh npx prisma contract emit] Metadata JSON nạp cấu trúc bảng vào app
>     └── 📄 contract.d.ts       <-- [MỚI TẠO chính xác từ lệnh npx prisma contract emit] Định nghĩa types TypeScript cho editor
> ```

---

<a id="bước-15-khởi-tạo-database-client-singleton"></a>
### Bước 1.5: Khởi tạo Database Client Singleton
- **Tập tin:** `backend/src/prisma/db.ts`
- **Hướng dẫn tư duy logic:** Áp dụng mẫu thiết kế **Singleton Pattern**. Ta chỉ khởi tạo một đối tượng kết nối `db` duy nhất và export ra cho toàn bộ ứng dụng dùng chung. Nếu mỗi file hay mỗi request đều tạo một `new Client()`, server sẽ nhanh chóng làm sập PostgreSQL vì cạn kiệt Connection Pool.

```typescript
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import contractJson from './contract.json' with { type: 'json' };

export const contract = contractFromJson(contractJson);
export const db = postgres({
  contract,
  url: process.env['DATABASE_URL'],
});
```

[⬆️ Quay lại Mục lục](#mục-lục)

---

<a id="3-giai-đoạn-2-xây-dựng-tính-năng-theo-3-tầng-kiến-trúc-service-controller-routes"></a>
## 3. Giai đoạn 2: Xây dựng tính năng theo 3 tầng kiến trúc (Service, Controller, Routes)

<a id="bước-21-tầng-service-backendsrcservicesauthservicejs---xử-lý-nghiệp-vụ-lõi"></a>
### Bước 2.1: Tầng Service (`backend/src/services/auth.service.js`) - Xử lý nghiệp vụ lõi
- **Hướng dẫn tư duy logic:**
  1. **Không nhận `req` hay `res`:** Tầng Service phải là một module thuần túy (pure logic), độc lập với framework web (Express). Điều này giúp ta có thể dễ dàng viết Unit Test tự động cho hàm này mà không cần giả lập (mock) đối tượng HTTP Request/Response.
  2. **Băm mật khẩu một chiều:** Mật khẩu gốc tuyệt đối không bao giờ được ghi vào Database. Muối (salt) 10 vòng sinh ra ngẫu nhiên làm biến đổi mật khẩu thành chuỗi ký tự loằng ngoằng. Kể cả quản trị viên Database cũng không thể đọc được mật khẩu gốc của người dùng.
  3. **Bắt buộc có từ khóa `await`:** Thao tác gọi DB và băm mật khẩu là tác vụ I/O bất đồng bộ tốn thời gian. Nếu thiếu `await`, hàm sẽ trả về `Promise` rỗng thay vì dữ liệu người dùng thực tế.
  4. **Quy tắc bảo mật đầu ra (Security Rule):** Dùng kỹ thuật Destructuring kết hợp Rest Operator `const { password: _, ...userWithoutPassword } = newUser` để loại bỏ hoàn toàn mật khẩu băm trước khi gửi kết quả về Controller.

```javascript
import { db } from "../prisma/db.ts";
import bcrypt from "bcryptjs";

async function registerUserService({ email, password, name }) {
  // 1. Kiểm tra email đã có người đăng ký chưa (SELECT ... WHERE email = ... LIMIT 1)
  const existingUser = await db.orm.public.User.where({ email }).first();
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // 2. Băm mật khẩu với salt 10 vòng
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Lưu user mới vào PostgreSQL (bắt buộc có await)
  const newUser = await db.orm.public.User.create({
    email,
    password: hashedPassword,
    name,
  });

  // 4. Nguyên tắc bảo mật: Lọc bỏ password trước khi trả về
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export default registerUserService;
```

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/src/
> ├── 📁 prisma/
> └── 📁 services/
>     └── 📄 auth.service.js     <-- [MỚI TẠO BẰNG TAY] Tầng xử lý nghiệp vụ băm mật khẩu và truy vấn PostgreSQL
> ```

---

<a id="bước-22-tầng-controller-backendsrccontrollersauthcontrollerjs---xử-lý-http-requestresponse"></a>
### Bước 2.2: Tầng Controller (`backend/src/controllers/auth.controller.js`) - Xử lý HTTP Request/Response
- **Hướng dẫn tư duy logic:**
  1. **Kỹ thuật Guard Clauses (Early Return):** Kiểm tra tính hợp lệ của dữ liệu ngay đầu hàm. Nếu thiếu email hoặc mật khẩu < 6 ký tự, lập tức ngắt hàm và trả về mã lỗi `400 Bad Request`. Cách viết này giúp mã nguồn phẳng (flat code), tránh việc lồng các khối `if...else` nhiều tầng khó bảo trì.
  2. **Gán mã trạng thái HTTP chuẩn mực RESTful:**
     - `201 Created`: Tạo mới tài nguyên người dùng thành công (thay vì trả về 200 OK chung chung).
     - `400 Bad Request`: Lỗi do Client gửi dữ liệu sai/thiếu định dạng.
     - `409 Conflict`: Xung đột tài nguyên (email đã có người đăng ký từ trước).
     - `500 Internal Server Error`: Lỗi máy chủ không mong muốn (mất kết nối DB, crash runtime...).

```javascript
import registerUserService from "../services/auth.service.js";

async function registerController(req, res) {
  // 1. Trích xuất dữ liệu từ body của Request
  const { email, password, name } = req.body;

  // 2. Validate dữ liệu đầu vào (Guard Clauses phòng thủ sớm)
  if (!email || !password) {
    return res.status(400).json({ message: "Email và password là bắt buộc" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
  }

  // 3. Gọi Service trong khối try...catch để phân loại mã lỗi HTTP
  try {
    const user = await registerUserService({ email, password, name });
    return res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "email này đã được sử dụng" });
    }
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
}

export default registerController;
```

> 📂 **MINH HỌA SỰ TIẾN HÓA CỦA THƯ MỤC:**
> ```text
> backend/src/
> ├── 📁 controllers/
> │   └── 📄 auth.controller.js  <-- [MỚI TẠO BẰNG TAY] Tầng nhận Request, validate dữ liệu và phản hồi HTTP Response
> ├── 📁 prisma/
> └── 📁 services/
>     └── 📄 auth.service.js
> ```

---

<a id="bước-23-tầng-routes--express-server---mở-cổng-kết-nối-mạng"></a>
### Bước 2.3: Tầng Routes & Express Server - Mở cổng kết nối mạng

#### A. Định tuyến: `backend/src/routes/auth.routes.js`
- **Hướng dẫn tư duy logic:** Gom toàn bộ các tuyến đường (routes) liên quan đến xác thực người dùng vào một Router riêng biệt, giúp code có tính module hóa cao, dễ bảo trì và phân quyền.
```javascript
import express from "express";
import registerController from "../controllers/auth.controller.js";

const router = express.Router(); // Chữ Router viết hoa chữ R

router.post("/register", registerController);

export default router;
```

#### B. Cấu hình ứng dụng Express: `backend/src/app.js`
- **Hướng dẫn tư duy logic:**
  - `app.use(cors())`: Cho phép trình duyệt tiếp nhận response khi gọi API từ domain/port khác.
  - `app.use(express.json())`: **BẮT BUỘC**. Mặc định Node.js nhận request stream dưới dạng byte thô. Middleware này giải mã stream đó thành JSON object gắn vào `req.body`. Nếu thiếu dòng này, `req.body` trong Controller sẽ luôn luôn là `undefined`.
  - `app.use("/api/auth", authRoutes)`: Gắn tiền tố chuẩn hóa `/api/auth` cho toàn bộ các route xác thực.

```javascript
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json()); // Bắt buộc để đọc được req.body

// Gắn route vào tiền tố /api/auth
app.use("/api/auth", authRoutes);

export default app;
```

#### C. Khởi động máy chủ: `backend/src/server.js`
- **Hướng dẫn tư duy logic:** Tách biệt rõ ràng giữa file cấu hình ứng dụng (`app.js`) và file thực thi máy chủ (`server.js`) theo nguyên tắc Clean Architecture. Nhờ việc không gọi `app.listen()` trực tiếp trong `app.js`, ta có thể import `app` vào các bài kiểm thử tự động (Integration Tests bằng Supertest/Jest) mà không bị chiếm dụng cổng mạng 5000.

```javascript
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
```

> 📂 **MINH HỌA CẤU TRÚC HOÀN CHỈNH CỦA THƯ MỤC `backend/src/`:**
> ```text
> backend/src/
> ├── 📁 controllers/
> │   └── 📄 auth.controller.js  # Lễ tân: Nhận request, validate dữ liệu, gán mã HTTP
> ├── 📁 prisma/
> │   ├── 📄 contract.prisma     # Lược đồ bảng cơ sở dữ liệu
> │   └── 📄 db.ts               # Kết nối Database Singleton
> ├── 📁 routes/
> │   └── 📄 auth.routes.js      # Cổng vào: Định tuyến đường dẫn URL
> ├── 📁 services/
> │   └── 📄 auth.service.js     # Bếp trưởng: Băm mật khẩu & giao tiếp PostgreSQL
> ├── 📄 app.js                  # Trái tim cấu hình Express, CORS, JSON Body Parser & Route Prefixes
> └── 📄 server.js               # Khởi động và lắng nghe cổng Port 5000
> ```

[⬆️ Quay lại Mục lục](#mục-lục)

---

<a id="4-giai-đoạn-3-kiểm-thử-toàn-diện-với-postman-bảng-test-cases"></a>
## 4. Giai đoạn 3: Kiểm thử toàn diện với Postman (Bảng Test Cases)

<a id="lệnh-chạy-khởi-động-hệ-thống-backend"></a>
### Lệnh chạy khởi động hệ thống Backend:
```bash
npm run dev
```

> 🔬 **GIẢI PHẪU CHI TIẾT LỆNH:**
> - `npm`: Gọi trình quản lý gói Node.js.
> - `run`: Lệnh yêu cầu npm tìm và thực thi một tập lệnh (script) tùy biến trong mục `"scripts"` của file `package.json`.
> - `dev`: Tên script cụ thể được gọi. Script này thực thi `"nodemon src/server.js"`, tự động reload server mỗi khi phát hiện mã nguồn có sự thay đổi.

> 📦 **MINH HỌA TRẠNG THÁI TIẾN TRÌNH HOẠT ĐỘNG:**
> ```text
> • Tiến trình Nodemon: Đang theo dõi mọi thay đổi trong thư mục backend/src/
> • Express Server: Lắng nghe tại địa chỉ http://localhost:5000
> • API Endpoint sẵn sàng tiếp nhận request: POST http://localhost:5000/api/auth/register
> ```

---

<a id="bảng-5-kịch-bản-kiểm-thử-chi-tiết-test-cases-checklist"></a>
### Bảng 5 Kịch bản Kiểm thử chi tiết (Test Cases Checklist):

- **Cấu hình trên Postman:**
  - Method: `POST`
  - URL: `http://localhost:5000/api/auth/register`
  - Headers: `Content-Type: application/json`
  - Body: Chọn `raw` -> định dạng `JSON`

| Mã TC | Tên kịch bản kiểm thử | Body gửi lên (JSON) | Kết quả mong đợi (Response) | Mã HTTP | Giải thích nghiệp vụ |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **TC1** | **Happy Path**<br>(Đăng ký thành công lần đầu) | `{"email": "hocfullstack@gmail.com", "password": "password123", "name": "Dev"}` | Nhận JSON: `{ "message": "Đăng ký thành công", "user": { "id": 1, "email": "...", "name": "Dev" } }`. **Tuyệt đối không có trường `password`**. | `201 Created` | Kiểm tra luồng chạy mượt mà từ đầu đến cuối; bảo đảm quy tắc an toàn dữ liệu không làm lộ mật khẩu băm ra bên ngoài. |
| **TC2** | **Validation**<br>(Gửi thiếu trường mật khẩu) | `{"email": "hocfullstack@gmail.com"}` | `{ "message": "Email và password là bắt buộc" }` | `400 Bad Request` | Kiểm tra tầng Controller có chặn đứng dữ liệu thiếu sót trước khi đẩy xuống Service hay không. |
| **TC3** | **Validation**<br>(Mật khẩu quá ngắn < 6 ký tự) | `{"email": "test@gmail.com", "password": "123"}` | `{ "message": "Mật khẩu tối thiểu 6 ký tự" }` | `400 Bad Request` | Bảo đảm độ phức tạp tối thiểu của mật khẩu người dùng trước khi lưu DB. |
| **TC4** | **Conflict**<br>(Đăng ký trùng email đã có) | `{"email": "hocfullstack@gmail.com", "password": "password123"}` *(Gửi lại đúng dữ liệu TC1)* | `{ "message": "email này đã được sử dụng" }` | `409 Conflict` | Kiểm tra câu truy vấn tìm kiếm email của Service và khả năng bắt lỗi trùng lặp gán mã 409 của Controller. |
| **TC5** | **Security DB**<br>(Kiểm tra trực tiếp PostgreSQL) | Chạy câu lệnh soi dữ liệu trong container PostgreSQL | Bản ghi có cột `password` mang giá trị băm dạng: `$2a$10$wK...` | Thành công | Đảm bảo mật khẩu được bảo vệ an toàn ngay cả khi Database bị hacker đánh cắp toàn bộ file dữ liệu. |

[⬆️ Quay lại Mục lục](#mục-lục)

---

<a id="5-sổ-tay-lỗi-kinh-điển-cần-tránh-lessons-learned"></a>
## 5. Sổ tay lỗi kinh điển cần tránh (Lessons Learned)

1. **Lỗi `ERR_MODULE_NOT_FOUND` (Quên đuôi mở rộng `.js`):**
   - *Nguyên nhân:* Khi cấu hình `"type": "module"`, Node.js tuân thủ nghiêm ngặt chuẩn ES Modules của trình duyệt và không tự động suy diễn đuôi file như CommonJS (`require`).
   - *Cách khắc phục:* Mọi file nội bộ tự viết khi import bắt buộc phải ghi rõ đuôi `.js`:
     ```javascript
     import app from "./app.js";       // ĐÚNG
     import app from "./app";          // SAI -> Bị lỗi crash server
     ```

2. **Lỗi nhầm lẫn Default Export vs Named Export:**
   - *Nguyên nhân:* Sử dụng dấu ngoặc nhọn `{}` cho các module xuất mặc định (Default Export).
   - *Cách khắc phục:* `express` và `cors` là default export, không dùng ngoặc nhọn:
     ```javascript
     import express from "express";    // ĐÚNG
     import { express } from "express"; // SAI -> express bị undefined
     ```

3. **Lỗi `express.router is not a function`:**
   - *Nguyên nhân:* Gõ chữ `r` thường thay vì chữ `R` hoa.
   - *Cách khắc phục:* Trong Express, hàm tạo router là `express.Router()`.

4. **Lỗi `req.body` bị `undefined`:**
   - *Nguyên nhân:* Quên dòng `app.use(express.json())` hoặc đặt nó nằm bên dưới dòng `app.use('/api/auth', ...)`.
   - *Cách khắc phục:* Luôn đặt `app.use(express.json())` ở ngay các dòng đầu tiên của `app.js` trước khi khai báo bất kỳ router nào.

5. **Lỗi thiếu `await` trong hàm bất đồng bộ:**
   - *Nguyên nhân:* Các tác vụ băm mật khẩu (`bcrypt.hash`) và ghi vào Database (`db.orm.public.User.create`) là tác vụ I/O tốn thời gian, luôn trả về Promise.
   - *Hậu quả:* Nếu quên `await`, biến `newUser` sẽ là một `Promise { <pending> }` rỗng, dẫn đến việc lọc password bị sai và client nhận dữ liệu rỗng.

6. **Bản chất khác biệt giữa Docker và `DATABASE_URL`:**
   - *Hiểu lầm thường gặp:* Nghĩ rằng dùng Docker thì không cần `DATABASE_URL`.
   - *Bản chất kỹ thuật:* Docker là "cái nhà" chứa phần mềm PostgreSQL đang chạy ngầm. `DATABASE_URL` là "địa chỉ nhà" để code Node.js biết đường kết nối vào container đó.

[⬆️ Quay lại Mục lục](#mục-lục)
