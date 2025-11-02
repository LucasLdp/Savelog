import { userRouter } from "@modules/users/user.routes";
import { Hono } from "hono";

export const privateRoutes = new Hono().route("/", userRouter);
