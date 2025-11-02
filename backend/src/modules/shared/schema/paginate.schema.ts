import z from "zod";

export const paginateSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  page: z.number().min(1).optional(),
});
