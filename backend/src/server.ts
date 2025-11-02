import { routes } from "@modules/shared/routes";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { logger } from "hono/logger";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpException } from "http-essentials";
import "@src/config/zod";
import "@src/config/logger";

const server = new Hono();

server.use(logger());

server.onError((err, c) => {
  if (err instanceof HttpException) {
    console.error("Error occurred:", err.message);
    return c.json({ message: err.message }, err.status as ContentfulStatusCode);
  }
  console.error("Unexpected error occurred:", err);
  return c.json({ message: "Internal Server Error" }, 500);
});

server
  .route("/", routes)
  .get(
    "/openapi",
    openAPIRouteHandler(routes, {
      documentation: {
        info: {
          title: "Savelog API",
          version: "1.0.0",
          description: "API para o sistema Savelog",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  .get(
    "/docs",
    Scalar({
      url: "/openapi",
    })
  );

Bun.serve({
  fetch: server.fetch,
  port: Number(process.env.PORT || 3000),
});

console.log(
  `🚀 Server is running on http://localhost:${process.env.PORT || 3000}/api`
);
