import { Hono } from "hono";
import { validator as zValidator, resolver, describeRoute } from "hono-openapi";
import {
  createUserSchema,
  updateUserSchema,
  selectUserSchema,
} from "./schema/user.schema";
import {
  createUser,
  deleteUser,
  findUser,
  listUser,
  updateUser,
} from "./cases";
import { paginateSchema } from "@modules/shared/schema/paginate.schema";
import { TAG } from "@src/docs/tags";

export const userRouter = new Hono()
  .basePath("/users")
  .get(
    "/",
    describeRoute({
      tags: [TAG.USERS],
      summary: "Lista todos os usuários",
      responses: {
        200: {
          description: "Listagem de usuários",
          content: {
            "application/json": {
              schema: resolver(selectUserSchema.array()),
            },
          },
        },
      },
    }),
    zValidator(`query`, paginateSchema),
    async (c) => {
      const { limit, offset, page } = c.req.valid(`query`);
      return c.json(await listUser({ limit, offset, page }));
    }
  )
  .get(
    "/:id",
    describeRoute({
      tags: [TAG.USERS],
      summary: "Obtém os detalhes de um usuário por ID",
      responses: {
        200: {
          description: "Detalhes do usuário",
          content: {
            "application/json": {
              schema: resolver(selectUserSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const { id } = c.req.param();
      return c.json(await findUser(id));
    }
  )
  .post(
    "/",
    describeRoute({
      tags: [TAG.USERS],
      summary: "Cria um novo usuário",
      responses: {
        201: {
          description: "Usuário criado com sucesso",
          content: {
            "application/json": {
              schema: resolver(selectUserSchema),
            },
          },
        },
      },
    }),
    zValidator("json", createUserSchema),
    async (c) => {
      const user = c.req.valid("json");
      await createUser(user);
      return c.json({ message: "Usuário criado com sucesso" }, 201);
    }
  )
  .put(
    "/:id",
    describeRoute({
      tags: [TAG.USERS],
      summary: "Atualiza um usuário existente por ID",
      responses: {
        200: {
          description: "Usuário atualizado com sucesso",
        },
      },
    }),
    zValidator("json", updateUserSchema),
    async (c) => {
      const { id } = c.req.param();
      const user = c.req.valid("json");
      await updateUser(id, user);
      return c.json({ message: "Usuário atualizado com sucesso" });
    }
  )
  .delete(
    "/:id",
    describeRoute({
      tags: [TAG.USERS],
      summary: "Exclui um usuário por ID",
      responses: {
        204: {
          description: "Usuário excluído com sucesso",
        },
      },
    }),
    async (c) => {
      const { id } = c.req.param();
      await deleteUser(id);
      return c.json({ message: "Usuário excluído com sucesso" }, 200);
    }
  );
