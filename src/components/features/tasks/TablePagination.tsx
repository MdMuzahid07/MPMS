"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <p className="text-muted-foreground text-[11px] font-medium">
        Showing {startItem} to {endItem} of {totalItems} tasks
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "ghost"}
              size="icon-sm"
              className="rounded-md"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};
