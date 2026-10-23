# CHEATSHEET: Tính Năng Đăng Ký Tài Khoản (Register)

---

## 1. Sơ đồ luồng dữ liệu (Data Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client (Postman / React)
    participant Route as routes/auth.routes.js
    participant Controller as controllers/auth.controller.js
    participant Service as services/auth.service.js
    participant DB as PostgreSQL (Docker)

    Client->>Route: POST /api/auth/register (email, password, name)
    Route->>Controller: Chuyển request tới registerController
    Note over Controller: 1. Validate: bắt buộc có email & password<br/>2. Validate: password.length >= 6
    
    Controller->>Service: Gọi registerUserService({ email, password, name })
    Service->>DB: User.where({ email }).first()
    
    alt Email đã tồn tại
        DB-->>Service: Trả về record user cũ
        Service-->>Controller: throw new Error("EMAIL_ALREADY_EXISTS")
        Controller-->>Client: HTTP 409 Conflict (Email đã được sử dụng)
    else Email chưa tồn tại
        DB-->>Service: null
        Note over Service: 3. bcrypt.genSalt(10)<br/>4. bcrypt.hash(password, salt)<br/>5. Loại bỏ password khỏi kết quả
        Service->>DB: User.create({ email, password: hashedPassword, name })
        DB-->>Service: Bản ghi newUser đầy đủ
        Service-->>Controller: Return { id, email, name, createdAt }
        Controller-->>Client: HTTP 201 Created (Đăng ký thành công + user data)
    end
```

---

## 2. Thống kê các bước thực hiện (Step-by-Step Implementation)

### Bước 1: Khởi tạo hạ tầng & Schema Database
1. Khởi động PostgreSQL 16 qua Docker: `docker compose up -d`.
2. Cấu hình biến môi trường trong file `.env`:  
   `DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/fullstack_db?schema=public"`
3. Định nghĩa bảng `User` trong file `src/prisma/contract.prisma` với các trường: `id`, `email (@unique)`, `password (String)`, `name`, `createdAt`.
4. Cập nhật schema & type cho Prisma: `npx prisma contract emit`.

### Bước 2: Tầng Nghiệp Vụ - Service (`src/services/auth.service.js`)
1. Import `db` từ `../prisma/db.ts` và thư viện `bcryptjs`.
2. Tìm kiếm trùng lặp: `await db.orm.public.User.where({ email }).first()`.
3. Kiểm tra điều kiện: Nếu user đã tồn tại $\rightarrow$ `throw new Error("EMAIL_ALREADY_EXISTS")`.
4. Băm mật khẩu an toàn: Sinh salt 10 vòng và hash: `await bcrypt.hash(password, 10)`.
5. Tạo bản ghi mới: `await db.orm.public.User.create({ email, password: hashedPassword, name })`.
6. Lọc bỏ password: `const { password: _, ...userWithoutPassword } = newUser; return userWithoutPassword;`.
7. `export default registerUserService;`.

### Bước 3: Tầng Điều Khiển - Controller (`src/controllers/auth.controller.js`)
1. Import `registerUserService` từ `../services/auth.service.js`.
2. Trích xuất dữ liệu: `const { email, password, name } = req.body;`.
3. Validate đầu vào (Guard Clause):
   - Nếu `!email || !password` $\rightarrow$ Trả về mã **HTTP 400**.
   - Nếu `password.length < 6` $\rightarrow$ Trả về mã **HTTP 400**.
4. Khối `try ... catch`:
   - `try`: Gọi `await registerUserService(...)` $\rightarrow$ Trả về mã **HTTP 201** kèm `{ message, user }`.
   - `catch`:
     - Nếu lỗi `"EMAIL_ALREADY_EXISTS"` $\rightarrow$ Trả về mã **HTTP 409**.
     - Các lỗi khác $\rightarrow$ Trả về mã **HTTP 500**.
5. `export default registerController;`.

### Bước 4: Tầng Định Tuyến & Cấu Hình Server (`routes`, `app.js`, `server.js`)
1. **Tạo Route (`src/routes/auth.routes.js`):**
   - Khởi tạo `const router = express.Router();`.
   - Khai báo: `router.post("/register", registerController);`.
   - `export default router;`.
2. **Cấu hình Express (`src/app.js`):**
   - Bật CORS: `app.use(cors());`.
   - Bật parser JSON: `app.use(express.json());`.
   - Gắn route: `app.use("/api/auth", authRoutes);`.
   - `export default app;`.
3. **Khởi chạy Server (`src/server.js`):**
   - Nạp biến môi trường: `import "dotenv/config";`.
   - Lắng nghe cổng: `app.listen(PORT, callback);`.

### Bước 5: Kiểm thử hoàn chỉnh (Postman / Thunder Client)
- Chạy server: `npm run dev` (lắng nghe cổng 5000).
- Gửi request `POST http://localhost:5000/api/auth/register` (Content-Type: `application/json`):
  - **Case 1 (Thành công):** Gửi đủ email, pass $\rightarrow$ Nhận **201 Created**, kiểm tra không lộ password.
  - **Case 2 (Validate):** Thiếu pass hoặc pass < 6 ký tự $\rightarrow$ Nhận **400 Bad Request**.
  - **Case 3 (Trùng lặp):** Gửi lại email vừa tạo $\rightarrow$ Nhận **409 Conflict**.

---

## 3. Danh sách file & Nhiệm vụ cốt lõi

| Đường dẫn file | Nhiệm vụ cốt lõi |
| :--- | :--- |
| `docker-compose.yml` | Khởi chạy cơ sở dữ liệu PostgreSQL 16 container (`fullstack_postgres`) trên cổng `5432`. |
| `.env` | Chứa chuỗi kết nối `DATABASE_URL` và cấu hình cổng `PORT=5000`. |
| `src/prisma/contract.prisma` | Khai báo cấu trúc bảng `User` (cột `id`, `email`, `password`, `name`, `createdAt`). |
| `src/prisma/db.ts` | Khởi tạo và export đối tượng kết nối `db` để thao tác DB qua Prisma ORM v8. |
| `src/services/auth.service.js` | Xử lý logic nghiệp vụ: Tìm trùng email, băm mật khẩu bằng `bcryptjs`, ghi vào DB và lọc bỏ `password`. |
| `src/controllers/auth.controller.js` | Tầng giao tiếp HTTP: Lấy `req.body`, validate đầu vào, điều phối gọi Service và trả mã HTTP (`201`, `400`, `409`, `500`). |
| `src/routes/auth.routes.js` | Định tuyến API: Gắn endpoint con `POST /register` với hàm `registerController`. |
| `src/app.js` | Cấu hình Express app: Kích hoạt `cors()`, middleware phân tích JSON `express.json()`, gắn router vào `/api/auth`. |
| `src/server.js` | File khởi động: Nạp biến môi trường (`dotenv/config`) và chạy server lắng nghe cổng 5000. |

---

## 4. Cạm bẫy & Lưu ý (Gotchas & Best Practices)

### Cạm bẫy cú pháp Node.js ES Modules (`"type": "module"`)
- **Luôn có đuôi mở rộng `.js`:** Khi import các file nội bộ trong dự án, bắt buộc phải có đuôi `.js` (ví dụ: `import app from "./app.js"`). Nếu thiếu đuôi sẽ bị văng lỗi `ERR_MODULE_NOT_FOUND`.
- **Default Export vs Named Export:** `express`, `cors`, controller và router đều dùng `export default`, vì vậy khi import **không được bọc trong ngoặc nhọn `{}`**.

### Cạm bẫy tầng Express
- **Viết hoa `Router`:** Hàm tạo router của Express bắt buộc viết hoa: `express.Router()`. Viết thường `express.router()` sẽ gây crash app (`TypeError: express.router is not a function`).
- **Thiếu middleware đọc JSON:** Bắt buộc phải có `app.use(express.json())` trước khi gọi routes. Nếu thiếu dòng này, `req.body` trong controller sẽ luôn là `undefined`.
- **Hàm `res.json()` chỉ nhận 1 tham số:** Không viết `res.json({ msg }, user)`. Phải gom chung vào một object: `res.json({ msg, user })`.

### Cạm bẫy Bất đồng bộ (Async/Await) & Prisma
- **Quên `await` khi gọi DB:** Quên `await` trước `db.orm.public.User.create(...)` khiến biến trả về là một `Promise` rỗng thay vì dữ liệu người dùng thật.
- **Cập nhật Schema:** Mỗi khi sửa file `contract.prisma`, cần chạy lệnh `npx prisma contract emit` để Prisma cập nhật lại schema và type cho hệ thống.

### Nguyên tắc Bảo mật (Security)
- **Tuyệt đối không lưu mật khẩu thô:** Bắt buộc băm mật khẩu bằng `bcrypt.hash(password, 10)` trước khi lưu xuống PostgreSQL.
- **Lọc bỏ mật khẩu ở đầu ra:** Dùng cú pháp bóc tách Destructuring `const { password: _, ...userWithoutPassword } = newUser;` trước khi gửi dữ liệu về client.
