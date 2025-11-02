import { db } from "@src/config/client";
import { NotFoundException } from "http-essentials";

export async function findUser(id: string) {
  const user = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.id, id),
    columns: {
      password: false,
    },
  });

  if (!user) {
    throw new NotFoundException("Usuário não encontrado");
  }

  return user;
}
