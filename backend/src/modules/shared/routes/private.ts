import { userRouter } from "@modules/users/user.routes";
import { Hono } from "hono";
import { jwt } from "hono/jwt";

export const privateRoutes = new Hono()
  .use("/*", async (c, next) => {
    const jwtMiddleware = jwt({
      secret: process.env.JWT_SECRET || "",
    });
    try {
      return await jwtMiddleware(c, next);
    } catch (error) {
      return c.json({ error: "Token inválido ou ausente" }, 401);
    }
  })
  .route("/", userRouter);
