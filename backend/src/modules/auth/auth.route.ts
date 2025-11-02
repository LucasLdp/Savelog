import { Hono } from "hono";
import { authSchema } from "./schema/auth.schema";
import { validator as zValidator, resolver, describeRoute } from "hono-openapi";
import { createUserSchema } from "@modules/users/schema/user.schema";
import { registerUser } from "./cases/register-user";
import { LoginUser } from "./cases/login-user";
import { TAG } from "@src/docs/tags";

export const authRoute = new Hono()
  .post(
    "/register",
    describeRoute({
      tags: [TAG.AUTH],
      summary: "Registro do usuário",
      description: "Rota para registro de um novo usuário.",
    }),
    zValidator("json", createUserSchema),
    async (c) => {
      const { email, password, username } = c.req.valid("json");
      await registerUser({ email, password, username });
      return c.json({ message: "Usuário registrado com sucesso" });
    }
  )
  .post(
    "/login",
    describeRoute({
      tags: [TAG.AUTH],
      summary: "Login do usuário",
      description: "Rota para autenticação do usuário.",
    }),
    zValidator("json", authSchema),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const token = await LoginUser({ email, password });
      return c.json({ token });
    }
  );
