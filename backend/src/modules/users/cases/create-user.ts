import { db } from "@src/config/client";
import { CreateUserDto } from "../schema/user.schema";
import { user } from "@src/database/user";
import { or, eq } from "drizzle-orm";
import { ConflictException } from "http-essentials";

export async function createUser(data: CreateUserDto) {
  const existingUser = await db.query.user.findFirst({
    where: or(eq(user.email, data.email), eq(user.username, data.username)),
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new ConflictException("Email já está em uso");
    }
    if (existingUser.username === data.username) {
      throw new ConflictException("Nome de usuário já está em uso");
    }
  }

  await db.insert(user).values(data);
}
