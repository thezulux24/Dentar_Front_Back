export interface PaginationMeta {
  total: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

export function renamePagination(meta: PaginationMeta) {
  return {
    total_items: meta.total,
    total_paginas: meta.totalPages,
    cantidad_por_pagina: meta.pageSize,
    pagina_actual: meta.currentPage,
  };
}
