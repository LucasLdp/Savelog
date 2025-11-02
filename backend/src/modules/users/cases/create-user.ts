import { db } from "@src/config/client";
import { CreateUserDto } from "../schema/user.schema";
import { user } from "@src/database/user";
import { handleUniqueConstraint } from "@src/utils/drizzle-database-error";

export async function createUser(data: CreateUserDto) {
  const hashedPassword = await Bun.password.hash(data.password);

  await db
    .insert(user)
    .values({ ...data, password: hashedPassword })
    .catch(
      handleUniqueConstraint({
        email: "Email já está em uso",
        username: "Nome de usuário já está em uso",
      })
    );
}
