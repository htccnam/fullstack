// ==============================================================================
// MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
// Tài liệu hướng dẫn chi tiết: docs/01-register-guide.md
//
// 1. [01-app:init]        - Khởi tạo thực thể ứng dụng Express (Application Instance)
// 2. [01-app:middlewares] - Cấu hình đường ống Middleware toàn cục (CORS & JSON Parser)
// 3. [01-app:routes]      - Gắn kết router nghiệp vụ với tiền tố URL chuẩn hóa (/api/auth)
// ==============================================================================

// Tại sao import 'express'?
// Để sử dụng hàm khởi tạo ứng dụng web và các built-in middleware có sẵn của Express.
import express from "express";

// Tại sao import 'cors'?
// Cho phép trình duyệt gọi API từ các domain/cổng khác nhau (Cross-Origin) an toàn.
import cors from "cors";

// Tại sao import 'authRoutes'?
// Nạp module router xác thực chứa các tuyến đường con như /register.
import authRoutes from "./routes/auth.routes.js";

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-app:init]
// • Mục tiêu của cụm logic:
//   Khởi tạo thực thể ứng dụng Express trung tâm (Application Instance) làm nền tảng kết nối toàn bộ Middleware và Routing.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Framework 'express'.
//   - Đầu ra: Đối tượng 'app' (Express Application) sở hữu các phương thức cấu hình mạng và đường ống HTTP.
// • Các bước thực hiện:
//   - Bước 1: Gọi hàm khởi tạo của express để tạo một phiên bản ứng dụng mới.
//     + Mã giả: app = express()
// • Gợi ý khi bí (Hints):
//   - Phương thức Express: "express()", "Express Application Factory"
//   - Khái niệm: "Top-level express function", "Express App Instance"
// ==============================================================================

// Tại sao gọi 'express()'?
// Khởi tạo một thực thể ứng dụng Express (Application Instance) hoàn chỉnh để quản lý
// toàn bộ vòng đời Request-Response, đường ống Middleware và bảng định tuyến (Routing Table).
const app = express();

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-app:middlewares]
// • Mục tiêu của cụm logic:
//   Thiết lập đường ống Middleware toàn cục để kiểm soát chia sẻ tài nguyên (CORS) và phân giải thân dữ liệu HTTP Request (JSON Body Parsing).
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Dòng dữ liệu thô (HTTP Request Stream) từ Client gửi lên.
//   - Đầu ra: Thêm HTTP Headers CORS vào phản hồi và gắn dữ liệu JSON đã phân giải vào 'req.body' cho các tầng tiếp theo.
// • Các bước thực hiện:
//   - Bước 1: Gắn middleware 'cors()' vào đầu đường ống để mở quyền truy cập tài nguyên cho Frontend.
//     + Mã giả: app.use(cors())
//   - Bước 2: Gắn middleware 'express.json()' ngay sau CORS để phân giải thân dữ liệu JSON thành JavaScript Object.
//     + Mã giả: app.use(express.json())
// • Gợi ý khi bí (Hints):
//   - Middleware Express: "app.use()", "express.json() built-in", "cors() middleware"
//   - Khái niệm: "Middleware Pipeline / Execution Order", "Same-Origin Policy (SOP)", "Request Body Parsing Stream"
// ==============================================================================

// Tại sao phải sử dụng middleware 'cors()'?
// Trình duyệt web mặc định tuân theo chính sách Same-Origin Policy (SOP), ngăn chặn Frontend
// (chạy ở cổng 5173) gọi API sang Backend (chạy ở cổng 5000). Middleware CORS sẽ thêm các HTTP Header
// (như Access-Control-Allow-Origin: *) để cho phép trình duyệt tiếp nhận response an toàn.
app.use(cors());

// Tại sao bắt buộc phải có 'app.use(express.json())' và phải đặt TRƯỚC các router?
// 1. Phân giải Body: Mặc định dữ liệu gửi lên server qua HTTP Request là một dòng dữ liệu thô (Stream of bytes).
//    Middleware này sẽ phân tích cú pháp (parse) dòng dữ liệu đó thành JavaScript Object và gán vào 'req.body'.
// 2. Vị trí quan trọng: Express chạy middleware theo thứ tự từ trên xuống dưới. Nếu đặt dòng này sau dòng
//    'app.use("/api/auth", ...)', các hàm controller sẽ chạy trước khi body được giải mã, khiến 'req.body' luôn bị undefined!
app.use(express.json());

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-app:routes]
// • Mục tiêu của cụm logic:
//   Gắn kết module router xác thực vào ứng dụng với tiền tố chuẩn hóa '/api/auth' và xuất thực thể 'app' phục vụ khởi chạy mạng hoặc kiểm thử tự động.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Chuỗi tiền tố đường dẫn '/api/auth', module định tuyến 'authRoutes'.
//   - Đầu ra: Hệ thống đường ống hoàn chỉnh xuất qua 'export default app'.
// • Các bước thực hiện:
//   - Bước 1: Đăng ký router nhánh với tiền tố danh mục '/api/auth'.
//     + Mã giả: app.use("/api/auth", authRoutes)
//   - Bước 2: Xuất đối tượng 'app' ra ngoài bằng 'export default' để tách biệt cấu hình với việc kích hoạt cổng mạng.
//     + Mã giả: export default app
// • Gợi ý khi bí (Hints):
//   - Cú pháp Express: "app.use(path, router)", "export default"
//   - Khái niệm kiến trúc: "Separation of Concerns: App vs Server", "RESTful API Prefixing", "Supertest Integration Testing Pattern"
// ==============================================================================

// Tại sao lại đặt tiền tố là "/api/auth"?
// Chuẩn hóa cấu trúc RESTful API:
// 1. Tiền tố '/api': Giúp phân biệt rõ ràng giữa các endpoint cung cấp dữ liệu JSON với các tuyến đường phục vụ web tĩnh.
// 2. Phân vùng '/auth': Tạo không gian tên (Namespace) cho nhóm chức năng xác thực.
//    Khi đó, route con '/register' bên trong authRoutes sẽ có URL truy cập hoàn chỉnh là: '/api/auth/register'.
app.use("/api/auth", authRoutes);

// Tại sao lại xuất 'app' mà không gọi luôn 'app.listen(5000)' tại file này?
// Áp dụng nguyên tắc Tách biệt mối quan tâm (Separation of Concerns):
// - File 'app.js': Chỉ chịu trách nhiệm cấu hình logic ứng dụng (Routing & Middleware Pipeline).
// - File 'server.js': Sẽ chịu trách nhiệm kích hoạt hạ tầng mạng (lắng nghe cổng Port).
// Việc tách biệt này cho phép ta import 'app' vào các bài test tự động (Integration Testing với Supertest)
// mà không cần thực sự mở cổng mạng làm phát sinh lỗi cổng đã bị chiếm (EADDRINUSE).
export default app;
