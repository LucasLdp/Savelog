import { db } from "@src/config/client";
import { CreateUserDto, UpdateUserDto } from "../schema/user.schema";
import { user } from "@src/database/user";
import { or, eq } from "drizzle-orm";
import { ConflictException } from "http-essentials";

export async function updateUser(id: string, data: UpdateUserDto) {
  const conditions = [eq(user.id, id)];
  
  if (data.email) {
    conditions.push(eq(user.email, data.email));
  }
  
  if (data.username) {
    conditions.push(eq(user.username, data.username));
  }

  const existingUser = await db.query.user.findFirst({
    where: or(...conditions),
  });

  if (!existingUser) {
    throw new ConflictException("Usuário não encontrado");
  }

  if (existingUser) {
    if (data.email && existingUser.email === data.email) {
      throw new ConflictException("Email já está em uso");
    }
    if (data.username && existingUser.username === data.username) {
      throw new ConflictException("Nome de usuário já está em uso");
    }
  }

  await db.update(user).set(data).where(eq(user.id, id));
}
