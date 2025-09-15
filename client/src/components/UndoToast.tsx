import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UndoToastProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  essayId: string;
}

export default function UndoToast({ onEdit, onDelete, onClose, essayId }: UndoToastProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const { toast } = useToast();

  const deleteEssayMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/essays/${essayId}`);
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
        className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 toast-slide-in"
        data-testid="toast-undo"
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0 sm:min-w-[400px]">
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm sm:text-base text-center sm:text-left">Essay recommendation submitted!</p>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              You have {timeLeft} seconds to edit or delete
            </p>
          </div>
          <div className="flex space-x-2 order-first sm:order-none">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm h-auto p-1"
              data-testid="button-edit-submission"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteEssayMutation.isPending}
              className="text-destructive hover:text-destructive/80 font-medium text-xs sm:text-sm h-auto p-1"
              data-testid="button-delete-submission"
            >
              {deleteEssayMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-auto p-1"
            data-testid="button-dismiss-toast"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
