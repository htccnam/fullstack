import { db } from "../prisma/db.ts";
import bcrypt from "bcryptjs";

async function registerUserService({ email, password, name }) {
  const exsistingUser = await db.orm.public.User.where({ email }).first();
  if (exsistingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await db.orm.public.User.create({
    email,
    password: hashedPassword,
    name,
  });
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}
export default registerUserService;
