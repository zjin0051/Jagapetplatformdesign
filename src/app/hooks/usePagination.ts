import { useEffect, useMemo, useState } from "react";

type UsePaginationResult<T> = {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  startIndex: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  goToPage: (page: number) => void;
  goNext: () => void;
  goPrevious: () => void;
};

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  resetDeps: unknown[] = [],
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, resetDeps);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, startIndex, itemsPerPage]);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  function goNext() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  function goPrevious() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    startIndex,
    setCurrentPage,
    goToPage,
    goNext,
    goPrevious,
  };
}
