import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationDemo({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const handlePageChange = (page: number) => {
    window.scrollTo(0, 30);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages - 1);
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="flex justify-between w-full">
        <PaginationItem>
          <PaginationPrevious
            className=" text-primary border border-gray-300 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        <div className=" flex">
          {renderPagination().map((page, index) =>
            page === "..." ? (
              <PaginationItem key={index}>
                <span className="px-3">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(Number(page))}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        </div>

        <PaginationItem>
          <PaginationNext
            className="border text-primary border-gray-300 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationDemo;
