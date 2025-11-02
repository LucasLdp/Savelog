import { db } from "@src/config/client";
import { AuthSchemaDto } from "../schema/auth.schema";
import { eq } from "drizzle-orm";
import { user } from "@src/database";
import { NotFoundException, UnauthorizedException } from "http-essentials";
import { password } from "bun";
import { sign } from "hono/jwt";

export async function LoginUser(data: AuthSchemaDto) {
  const verifyUser = await db.query.user.findFirst({
    where: eq(user.email, data.email),
  });

  if (!verifyUser) {
    throw new NotFoundException("Usuário não encontrado");
  }

  const verifyPassword = await password.verify(
    data.password,
    verifyUser.password
  );

  if (!verifyPassword) {
    throw new UnauthorizedException("Senha incorreta");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não está configurado no .env");
  }

  const token = await sign({ sub: verifyUser.id }, process.env.JWT_SECRET);

  return token;
}
