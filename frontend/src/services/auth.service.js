import api from "./api";

async function loginApi({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return response;
}
export default loginApi;
