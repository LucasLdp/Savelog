import { authRoute } from "@modules/auth/auth.route";
import { Hono } from "hono";

export const publicRoutes = new Hono().route("/", authRoute);
