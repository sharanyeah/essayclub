import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Essay } from "@shared/schema";

interface SuccessToastProps {
  essay: Essay;
  onEdit: () => void;
  onClose: () => void;
}

export default function SuccessToast({ essay, onEdit, onClose }: SuccessToastProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const { toast } = useToast();

  const deleteEssayMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/essays/${essay.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/essays"] });
      toast({
        title: "Essay deleted",
        description: "Your recommendation has been removed.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete essay. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete essay:", error);
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleDelete = () => {
    deleteEssayMutation.mutate();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50"
        data-testid="success-toast"
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-center justify-between min-w-0 sm:min-w-[450px]">
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm sm:text-base">✅ Essay submitted!</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your recommendation has been added • {timeLeft}s to edit or delete
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm h-auto px-2 py-1"
              data-testid="button-edit-submission"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteEssayMutation.isPending}
              className="text-destructive hover:text-destructive/80 font-medium text-xs sm:text-sm h-auto px-2 py-1"
              data-testid="button-delete-submission"
            >
              {deleteEssayMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-auto p-1"
              data-testid="button-dismiss-toast"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}