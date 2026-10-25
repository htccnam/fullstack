// ==============================================================================
// MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
// Tài liệu hướng dẫn chi tiết: docs/01-register-guide.md
//
// 1. [01-auth-service:register] - Xử lý nghiệp vụ đăng ký tài khoản, kiểm tra trùng lặp & băm mật khẩu
// ==============================================================================

// Tại sao import 'db' từ '../prisma/db.ts'?
// Áp dụng mẫu thiết kế Singleton: Toàn bộ ứng dụng chỉ chia sẻ duy nhất một đối tượng Database Client
// để quản lý Connection Pool tới PostgreSQL hiệu quả, tránh cạn kiệt tài nguyên kết nối của máy chủ.
import { db } from "../prisma/db.ts";

// Tại sao import 'bcryptjs'?
// Thuật toán băm mật khẩu một chiều thích ứng (Adaptive One-way Hash) tiêu chuẩn công nghiệp;
// tự động tích hợp Salt ngẫu nhiên chống tấn công từ điển (Dictionary Attack) và bảng tra trước (Rainbow Table).
import bcrypt from "bcryptjs";

// ==============================================================================
// KHUNG HƯỚNG DẪN CODE LẠI (FUNCTION-LEVEL SCAFFOLDING)
// • Đầu đề định danh (Sub-ID): [01-auth-service:register]
// • Mục tiêu của hàm:
//   Xử lý nghiệp vụ đăng ký tài khoản người dùng, kiểm tra trùng lặp email, băm mật khẩu bảo mật và lưu trữ bản ghi vào PostgreSQL.
// • Đầu vào / Đầu ra (Input/Output):
//   - Đầu vào: Tham số dạng Destructured Object: { email, password, name }.
//   - Đầu ra: Object thông tin User an toàn (đã bóc tách loại bỏ password). Ném Exception 'EMAIL_ALREADY_EXISTS' nếu trùng lặp.
// • Các bước thực hiện:
//   - Bước 1: Kiểm tra email đã có người đăng ký chưa bằng câu lệnh tìm kiếm trong DB.
//     + Mã giả: bản_ghi_cũ = await db.orm.public.User.where({ email }).first()
//   - Bước 2: Nếu đã tồn tại bản ghi, ngắt sớm và ném ngoại lệ Domain Exception.
//     + Mã giả: nếu (bản_ghi_cũ) thì ném Ngoại_Lệ("EMAIL_ALREADY_EXISTS")
//   - Bước 3: Tạo muối ngẫu nhiên (salt) 10 vòng và thực hiện băm mật khẩu.
//     + Mã giả: salt = await bcrypt.genSalt(10)
//     + Mã giả: hashedPassword = await bcrypt.hash(password, salt)
//   - Bước 4: Lưu bản ghi người dùng mới vào bảng User trong PostgreSQL với mật khẩu đã băm.
//     + Mã giả: newUser = await db.orm.public.User.create({ email, password: hashedPassword, name })
//   - Bước 5: Bóc tách loại bỏ trường password khỏi kết quả trả về theo nguyên tắc bất biến (Immutability).
//     + Mã giả: { password: _, ...userWithoutPassword } = newUser
//     + Mã giả: trả_về userWithoutPassword
// • Gợi ý khi bí (Hints):
//   - Truy vấn Prisma v8: "db.orm.public.User.where().first()", "db.orm.public.User.create()"
//   - Thư viện Bcrypt: "bcrypt.genSalt(rounds)", "bcrypt.hash(data, salt)"
//   - Cú pháp JavaScript ES6: "Object Destructuring Rest Pattern ({ password: _, ...rest })"
//   - Triết lý lập trình: "Fail-Fast Principle", "Domain Exception Pattern", "Pure Service Layer"
// ==============================================================================

// Tại sao hàm nhận tham số dạng object '{ email, password, name }' và là 'async'?
// 1. Destructuring: Không bị ràng buộc vào thứ tự truyền tham số và độc lập hoàn toàn với đối tượng 'req' của Express.
// 2. 'async': Các thao tác truy vấn DB và băm mật khẩu đều là tác vụ I/O bất đồng bộ cần thời gian xử lý non-blocking.
async function registerUserService({ email, password, name }) {
  // Tại sao phải kiểm tra email TRƯỚC khi băm mật khẩu?
  // Nguyên tắc Fail-Fast: Băm mật khẩu bằng Bcrypt rất tốn CPU. Kiểm tra email trước giúp ngắt sớm,
  // tránh lãng phí năng lượng tính toán của máy chủ nếu tài khoản đã tồn tại từ trước.
  const existingUser = await db.orm.public.User.where({ email }).first();

  // Tại sao lại ném Error thay vì trả về chuỗi hay mã lỗi HTTP?
  // Tầng Service là tầng nghiệp vụ thuần túy (Protocol-agnostic). Việc ném Domain Exception giúp tầng Controller bên trên
  // tự quyết định chuyển đổi thành mã trạng thái HTTP phù hợp (như 409 Conflict) hoặc CLI/gRPC handler sử dụng lại được.
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // Tại sao chọn salt rounds = 10?
  // 10 vòng là tiêu chuẩn vàng của ngành: Đủ nhanh để server phản hồi trong ~0.1s cho người dùng thật,
  // nhưng đủ nặng để vô hiệu hóa các dàn máy đào GPU của kẻ tấn công muốn dò mật khẩu.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tại sao bắt buộc phải có từ khóa 'await'?
  // Ghi dữ liệu xuống ổ đĩa PostgreSQL là tác vụ Promise bất đồng bộ.
  // Nếu thiếu 'await', biến newUser sẽ là một Promise rỗng đang chờ xử lý, khiến dữ liệu bên dưới bị lỗi.
  const newUser = await db.orm.public.User.create({
    email,
    password: hashedPassword, // Lưu mật khẩu ĐÃ BĂM, tuyệt đối không lưu plain text
    name,
  });

  // Tại sao dùng Destructuring Rest Operator thay vì lệnh 'delete newUser.password'?
  // Tuân thủ nguyên tắc Bất biến (Immutability): Không chỉnh sửa trực tiếp trên object gốc.
  // Cú pháp này bóc tách trường 'password' sang biến rác '_', gom toàn bộ các trường an toàn còn lại
  // vào object mới 'userWithoutPassword', ngăn chặn 100% rủi ro vô tình làm lộ hash password ra client.
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
}

// Xuất các hàm nghiệp vụ để tầng Controller import và sử dụng (Hỗ trợ cả Default và Named Export)
export default registerUserService;
export { registerUserService };
