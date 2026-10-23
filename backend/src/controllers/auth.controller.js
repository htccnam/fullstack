import registerUserService from "../services/auth.service.js";

async function registerController(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email và password là bắt buộc" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
  }
  try {
    const user = await registerUserService({ email, password, name });
    return res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "email này đã được sử dụng" });
    } else {
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  }
}
export default registerController;
