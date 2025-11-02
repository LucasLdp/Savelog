import { Table } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export function createDrizzleZodSchemas<
  T extends Table,
  TInsertOmit extends Partial<Record<keyof T["$inferInsert"], true>> = {},
  TSelectOmit extends Partial<Record<keyof T["$inferSelect"], true>> = {},
  TUpdateOmit extends Partial<Record<keyof T["$inferInsert"], true>> = {}
>(
  table: T,
  options?: {
    insertOmit?: TInsertOmit;
    selectOmit?: TSelectOmit;
    updateOmit?: TUpdateOmit;
  }
) {
  const insertSchema = options?.insertOmit
    ? createInsertSchema(table).omit({ id: true, ...options.insertOmit })
    : createInsertSchema(table).omit({ id: true });

  const selectSchema = options?.selectOmit
    ? createSelectSchema(table).omit(options.selectOmit)
    : createSelectSchema(table);

  const updateSchema = options?.updateOmit
    ? createUpdateSchema(table)
        .omit({ id: true, ...options.updateOmit })
        .partial()
    : createUpdateSchema(table).omit({ id: true }).partial();

  return {
    insert: insertSchema,
    select: selectSchema,
    update: updateSchema,
  };
}
