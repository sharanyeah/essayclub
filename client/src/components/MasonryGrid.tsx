import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Essay } from "@shared/schema";

interface MasonryGridProps {
  onOpenModal: (essay: Essay) => void;
}

export default function MasonryGrid({ onOpenModal }: MasonryGridProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/essays", { page, limit }],
    queryFn: async () => {
      const response = await fetch(`/api/essays?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch essays");
      return response.json();
    },
  });

  const essays = data?.essays || [];
  const total = data?.total || 0;
  const hasMore = essays.length < total;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading && page === 1) {
    return (
      <div 
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-0"
        style={{
          columnGap: '1.5rem',
          columnFill: 'balance'
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="break-inside-avoid" style={{ marginBottom: '1.5rem' }}>
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load essays. Please try again.</p>
      </div>
    );
  }

  if (essays.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 sm:py-12 px-4"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              📚
            </motion.div>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-2">
            No essays yet
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Be the first to recommend an essay to the club!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div data-testid="masonry-grid" className="px-4 sm:px-6 lg:px-8">
      <div 
        className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 space-y-0"
        style={{
          columnGap: '1.5rem',
          columnFill: 'balance'
        }}
      >
        {essays.map((essay: Essay, index: number) => (
          <PostCard
            key={essay.id}
            essay={essay}
            onOpenModal={onOpenModal}
            index={index}
          />
        ))}
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 sm:mt-12"
        >
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="bg-muted text-muted-foreground px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-muted/80 transition-all"
            data-testid="button-load-more"
          >
            Load More Essays
          </Button>
        </motion.div>
      )}
    </div>
  );
}
