import { Hono } from "hono";
import { privateRoutes } from "./private";
import { publicRoutes } from "./public";

export const routes = new Hono()
  .basePath("/api")
  .get("/", (c) => c.json({ message: "Hello world" }))
  .route("/", publicRoutes)
  .route("/", privateRoutes);
