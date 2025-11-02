import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const user = pgTable("users", {
  id: varchar()
    .$defaultFn(() => createId())
    .primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 256 }).notNull(),
  photoUrl: varchar("photoUrl"),
});
