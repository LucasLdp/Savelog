import { CreateUserDto } from "@modules/users/schema/user.schema";
import { db } from "@src/config/client";
import { user } from "@src/database";
import { handleUniqueConstraint } from "@src/utils/drizzle-database-error";

export async function registerUser(data: CreateUserDto) {
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
