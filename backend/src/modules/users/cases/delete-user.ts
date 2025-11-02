import { db } from "@src/config/client";
import { CreateUserDto } from "../schema/user.schema";
import { user } from "@src/database/user";
import { or, eq } from "drizzle-orm";
import { ConflictException } from "http-essentials";

export async function deleteUser(id: string) {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!existingUser) {
    throw new ConflictException("Usuário não encontrado");
  }

  await db.delete(user).where(eq(user.id, id));
}
