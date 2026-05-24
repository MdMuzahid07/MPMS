"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeamTableFooterProps {
  visibleCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TeamTableFooter = ({
  visibleCount,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: TeamTableFooterProps) => {
  return (
    <div className="bg-muted/30 border-border flex items-center justify-between border-t px-5 py-3">
      <p className="text-muted-foreground text-[11px] font-medium">
        Showing {visibleCount} of {totalCount} members
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
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
