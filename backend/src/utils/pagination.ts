import type { ResponseMeta } from "./api-response.js";

export function buildPaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): ResponseMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
