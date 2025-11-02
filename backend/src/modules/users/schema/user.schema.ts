import { user } from "@src/database/user";
import { createDrizzleZodSchemas } from "@src/utils/drizzle-zod";
import z from "zod";

const {
  insert: createUserSchema,
  select: selectUserSchema,
  update: updateUserSchema,
} = createDrizzleZodSchemas(user, {
  insertOmit: { photoUrl: true },
  updateOmit: { photoUrl: true, password: true },
  selectOmit: { password: true },
});

export { createUserSchema, selectUserSchema, updateUserSchema };

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type SelectUserDto = z.infer<typeof selectUserSchema>;
