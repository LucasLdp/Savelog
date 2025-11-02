import { Hono } from "hono";
import { privateRoutes } from "./private";

export const routes = new Hono()
  .basePath("/api")
  .get("/", (c) => c.json({ message: "Hello world" }))
  .route("/", privateRoutes);
