// ==============================================================================
// MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
// Tài liệu hướng dẫn chi tiết: docs/01-register-guide.md
//
// 1. [01-auth-controller:register] - Điều phối yêu cầu đăng ký tài khoản (HTTP Handler)
// ==============================================================================

// Tại sao import Service vào Controller?
// Tuân thủ nguyên tắc Tách biệt trách nhiệm (Separation of Concerns):
// Controller chỉ đóng vai trò "lễ tân" tiếp nhận và phản hồi giao thức HTTP,
// tuyệt đối không tự viết code băm mật khẩu hay gọi Database tại đây mà ủy thác toàn bộ cho tầng Service.
import registerUserService from "../services/auth.service.js";

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-auth-controller:register]
// • Mục tiêu của hàm:
//   Tiếp nhận HTTP Request từ Client, kiểm tra tính hợp lệ dữ liệu đầu vào (Validation),
//   ủy thác nghiệp vụ cho tầng Service và phản hồi HTTP Response chuẩn RESTful.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Đối tượng 'req' (chứa 'req.body') và 'res' (phương thức phản hồi) của Express.
//   - Đầu ra: Phản hồi JSON kèm HTTP Status Code: 201 (Tạo mới thành công), 400 (Dữ liệu không hợp lệ), 409 (Email xung đột), 500 (Lỗi máy chủ nội bộ).
// • Các bước thực hiện:
//   - Bước 1: Trích xuất các trường 'email', 'password', 'name' từ 'req.body'.
//     + Mã giả: { email, password, name } = req.body
//   - Bước 2: Kiểm tra phòng thủ sớm (Guard Clauses) với các trường bắt buộc và độ dài mật khẩu:
//     + Mã giả: Nếu (!email || !password) -> trả_về res.status(400).json(...)
//     + Mã giả: Nếu (password.length < 6) -> trả_về res.status(400).json(...)
//   - Bước 3: Thiết lập khối xử lý an toàn 'try ... catch':
//     + Mã giả:
//       thử:
//         user = await registerUserService({ email, password, name })
//         trả_về res.status(201).json({ message: "...", user })
//       bắt (lỗi):
//         nếu lỗi.message == "EMAIL_ALREADY_EXISTS" -> trả_về res.status(409).json(...)
//         ngược lại -> trả_về res.status(500).json(...)
// • Gợi ý khi bí (Hints):
//   - Đối tượng Express: "req.body", "res.status()", "res.json()"
//   - Mã trạng thái HTTP: "201 Created", "400 Bad Request", "409 Conflict", "500 Internal Server Error"
//   - Kỹ thuật lập trình: "Guard Clauses / Early Return Pattern", "try...catch HTTP Exception Mapping"
// ==============================================================================

// Tại sao hàm nhận 2 tham số '(req, res)' và là hàm 'async'?
// 1. 'req' (Request): Chứa toàn bộ dữ liệu Client gửi lên (Headers, Body, Params).
// 2. 'res' (Response): Đối tượng cung cấp các phương thức để server gửi dữ liệu trả về cho Client.
// 3. 'async': Vì bên trong có lời gọi hàm Service bất đồng bộ tương tác với Database cần 'await'.
async function registerController(req, res) {
  // Tại sao trích xuất (Destructuring) ngay dòng đầu tiên?
  // Giúp code tường minh, chỉ lấy các trường cần thiết phục vụ đăng ký và tránh việc gõ lặp lại 'req.body....'.
  const { email, password, name } = req.body;

  // Tại sao dùng kỹ thuật Guard Clauses (Early Return) với mã HTTP 400?
  // 1. Phòng thủ sớm: Chặn đứng dữ liệu rác/thiếu sót ngay tại cửa khẩu trước khi tốn tài nguyên gọi xuống Service/DB.
  // 2. 'return': Ngắt hàm lập tức, giữ code phẳng (flat code), tránh lồng if-else nhiều tầng phức tạp.
  // 3. HTTP 400 (Bad Request): Chuẩn RESTful chỉ định lỗi xuất phát từ phía người dùng gửi dữ liệu không hợp lệ.
  if (!email || !password) {
    return res.status(400).json({ message: "Email và password là bắt buộc" });
  }

  // Tại sao kiểm tra độ dài mật khẩu ở Controller thay vì Service?
  // Nguyên tắc Fail-Fast: Kiểm tra nhanh chuỗi ký tự trên bộ nhớ RAM; nếu mật khẩu quá ngắn thì từ chối ngay,
  // tránh lãng phí chi phí tính toán băm mật khẩu (CPU-intensive) của thuật toán Bcrypt bên dưới.
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
  }

  // Tại sao phải bọc lời gọi Service trong khối 'try ... catch'?
  // Tầng Service có thể ném ra (throw) các ngoại lệ nghiệp vụ (như trùng email) hoặc lỗi sập kết nối DB.
  // Controller bắt buộc phải bắt (catch) các ngoại lệ này để chuyển đổi (map) thành mã trạng thái HTTP phù hợp cho Client.
  try {
    // Gọi Service và chờ kết quả bản ghi được tạo trong PostgreSQL
    const user = await registerUserService({ email, password, name });

    // Tại sao dùng mã HTTP 201 thay vì 200?
    // Theo quy chuẩn RESTful API: Mã 201 (Created) thông báo rõ ràng rằng một tài nguyên mới (User)
    // đã được tạo thành công trên hệ thống máy chủ, chuẩn xác hơn mã 200 (OK) thông thường.
    return res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    // Tại sao phân biệt lỗi 'EMAIL_ALREADY_EXISTS' với mã HTTP 409?
    // HTTP 409 (Conflict): Chuẩn quốc tế biểu thị sự xung đột trạng thái dữ liệu trên máy chủ (email đã bị đăng ký trước).
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "email này đã được sử dụng" });
    } else {
      // Tại sao lỗi không lường trước lại trả về mã HTTP 500?
      // HTTP 500 (Internal Server Error): Báo cho Client biết lỗi xảy ra từ phía nội bộ máy chủ;
      // đồng thời che giấu chi tiết lỗi kỹ thuật nhạy cảm (Stack Trace) để đảm bảo an ninh mạng.
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  }
}

// Xuất Controller để tầng Routes gắn vào endpoint URL tương ứng
export default registerController;
