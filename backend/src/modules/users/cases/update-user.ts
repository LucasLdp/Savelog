import { db } from "@src/config/client";
import { UpdateUserDto } from "../schema/user.schema";
import { user } from "@src/database/user";
import { eq } from "drizzle-orm";
import { NotFoundException } from "http-essentials";
import { handleUniqueConstraint } from "@src/utils/drizzle-database-error";

export async function updateUser(id: string, data: UpdateUserDto) {
  const [updatedUser] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning({ id: user.id })
    .catch(
      handleUniqueConstraint({
        email: "Email já está em uso",
        username: "Nome de usuário já está em uso",
      })
    );

  if (!updatedUser) {
    throw new NotFoundException("Usuário não encontrado");
  }
}
