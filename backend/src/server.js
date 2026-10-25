// ==============================================================================
// MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
// Tài liệu hướng dẫn chi tiết: docs/01-register-guide.md
//
// 1. [01-server:bootstrap] - Khởi tạo môi trường & nạp ứng dụng Express
// 2. [01-server:listen]    - Cấu hình cổng mạng & kích hoạt HTTP Server lắng nghe
// ==============================================================================

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-server:bootstrap]
// • Mục tiêu của cụm logic:
//   Nạp toàn bộ cấu hình biến môi trường và nạp thực thể ứng dụng Express đã sẵn sàng logic.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: File cấu hình môi trường '.env' trên ổ đĩa.
//   - Đầu ra: 'process.env' được nạp dữ liệu và đối tượng ứng dụng 'app' (Express Application).
// • Các bước thực hiện:
//   - Bước 1: Nạp cấu hình từ file '.env' vào tiến trình môi trường trước tất cả các module khác.
//     + Mã giả: nạp_môi_trường('dotenv/config')
//   - Bước 2: Nạp đối tượng ứng dụng Express đã cấu hình middleware & routes từ module nội bộ.
//     + Mã giả: nạp_thực_thể app từ './app.js'
// • Gợi ý khi bí (Hints):
//   - Module preload: "dotenv/config", "process.env"
//   - Nguyên lý kiến trúc: "Separation of Concerns: app.js vs server.js"
// ==============================================================================

// Tại sao import 'dotenv/config' ngay tại dòng đầu tiên của server.js?
// Đảm bảo toàn bộ các biến môi trường trong file '.env' được nạp vào 'process.env'
// trước khi bất kỳ file hay logic nào khác trong ứng dụng được đọc và thực thi.
import "dotenv/config";

// Tại sao import 'app' từ './app.js'?
// Áp dụng nguyên tắc Tách biệt mối quan tâm (Separation of Concerns):
// - File 'app.js': Chỉ đảm nhận cấu hình logic ứng dụng (Routing, Middleware, Error Handlers).
//   Điều này giúp dễ dàng tái sử dụng khi viết Unit / Integration Test (ví dụ dùng Supertest)
//   mà không cần mở cổng mạng thật.
// - File 'server.js': Đóng vai trò là "công tắc vật lý" (Entry Point) chịu trách nhiệm duy nhất là mở cổng mạng.
import app from "./app.js";

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-server:listen]
// • Mục tiêu của cụm logic:
//   Xác định cổng mạng với cơ chế dự phòng và khởi chạy máy chủ HTTP để lắng nghe kết nối.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Biến môi trường 'PORT' (hoặc fallback mặc định) và hàm callback thông báo.
//   - Đầu ra: Tiến trình máy chủ HTTP (Node.js http.Server) chạy ngầm và mở cổng TCP.
// • Các bước thực hiện:
//   - Bước 1: Lấy cổng mạng từ 'process.env.PORT', nếu chưa có thì gán giá trị dự phòng 5000.
//     + Mã giả: PORT = process.env.PORT || 5000
//   - Bước 2: Gọi phương thức listen của app để liên kết cổng và chạy callback khi thành công.
//     + Mã giả: app.listen(PORT, callback_thông_báo)
// • Gợi ý khi bí (Hints):
//   - Dự phòng toán tử: "Logical OR (||) fallback pattern"
//   - Express Network: "app.listen(port, [callback])", "Port binding pattern"
// ==============================================================================

// Tại sao dùng cú pháp toán tử logic OR '|| 5000'?
// Cơ chế chịu lỗi dự phòng (Fallback Pattern):
// 1. Môi trường Production / Cloud (Render, AWS, Railway): Nền tảng sẽ tự động inject cổng ngẫu nhiên qua 'process.env.PORT'.
// 2. Môi trường Development Local: Nếu lập trình viên quên khai báo PORT trong '.env', server vẫn tự động dùng cổng 5000, không bị crash.
const PORT = process.env.PORT || 5000;

// Tại sao gọi 'app.listen()'?
// Bắt đầu mở cổng mạng TCP và lắng nghe các HTTP Request gửi tới.
// Hàm callback truyền vào sẽ chạy ngay khi server liên kết (bind) cổng thành công để in ra URL sẵn sàng phục vụ.
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
