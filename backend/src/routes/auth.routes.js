// ==============================================================================
// MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
// Tài liệu hướng dẫn chi tiết: docs/01-register-guide.md
//
// 1. [01-auth-routes:register] - Định tuyến endpoint POST /register tới Controller
// ==============================================================================

// Tại sao import 'express'?
// Để sử dụng hàm factory 'express.Router()' tạo ra một phiên bản định tuyến độc lập (Mini-application),
// giúp tách biệt hoàn toàn các tuyến đường xác thực khỏi file cấu hình máy chủ chính.
import express from "express";

// Tại sao import 'registerController'?
// Router chỉ đóng vai trò là "biển chỉ đường" (Traffic Controller). Khi có request gửi tới URL,
// router sẽ điều phối và ủy thác toàn bộ việc kiểm tra dữ liệu và phản hồi cho Controller xử lý.
import registerController from "../controllers/auth.controller.js";

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-auth-routes:register]
// • Mục tiêu của cụm logic:
//   Khởi tạo module định tuyến độc lập và ánh xạ phương thức HTTP POST '/register' tới hàm Controller xử lý.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Express module, hàm xử lý 'registerController' và đường dẫn URL con '/register'.
//   - Đầu ra: Đối tượng 'router' (Express Router Instance) sẵn sàng xuất ra ngoài để nạp vào 'app.js'.
// • Các bước thực hiện:
//   - Bước 1: Khởi tạo thực thể Router độc lập từ framework Express.
//     + Mã giả: router = express.Router()
//   - Bước 2: Đăng ký tuyến đường với phương thức POST và gắn hàm Controller xử lý.
//     + Mã giả: router.post("/register", registerController)
//   - Bước 3: Xuất đối tượng router bằng 'export default' để gắn tiền tố '/api/auth' trong app.js.
// • Gợi ý khi bí (Hints):
//   - Đối tượng Express: "express.Router()", "router.post(path, ...handlers)"
//   - Chuẩn HTTP: "HTTP POST Method RFC 9110", "Modular Route Architecture"
// ==============================================================================

// Tại sao dùng 'express.Router()' thay vì gắn trực tiếp 'app.post(...)' vào file server?
// Module hóa định tuyến (Modular Routing): Tách các tuyến đường theo từng nhóm tính năng riêng biệt
// (auth, users, products). Giúp mã nguồn ngăn nắp, dễ bảo trì, dễ dàng gắn middleware bảo vệ riêng
// và cho phép đặt tiền tố chung (như '/api/auth') một cách tập trung tại file 'app.js'.
const router = express.Router(); // Lưu ý chữ 'Router' bắt buộc viết hoa chữ R

// Tại sao lại dùng phương thức 'POST' thay vì 'GET'?
// 1. Bảo mật: Phương thức GET truyền dữ liệu qua query string trên URL, sẽ bị lưu lại trong lịch sử duyệt web
//    và access logs của máy chủ, làm lộ mật khẩu. POST truyền dữ liệu ngầm trong Request Body an toàn hơn.
// 2. Chuẩn RESTful: Phương thức POST đại diện cho hành động tạo mới một tài nguyên (Tạo tài khoản User).
router.post("/register", registerController);

// Xuất router để file 'app.js' nạp vào hệ thống thông qua lệnh 'app.use("/api/auth", authRoutes)'
export default router;
