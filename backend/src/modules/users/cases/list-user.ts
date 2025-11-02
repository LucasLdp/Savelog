import { db } from "@src/config/client";
import { user } from "@src/database/user";
import { count, getTableColumns } from "drizzle-orm";

interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export async function listUser({
  page = 1,
  limit = 10,
  offset = 0,
}: PaginationParams = {}) {
  const [data, totalResult] = await Promise.all([
    db.query.user.findMany({
      orderBy: (users, { asc }) => asc(users.id),
      limit,
      offset: offset || (page - 1) * limit,
      columns: {
        password: false,
      },
    }),
    db.select({ count: count() }).from(user),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
