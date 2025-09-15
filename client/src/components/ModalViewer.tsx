import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Essay } from "@shared/schema";

interface ModalViewerProps {
  essay: Essay;
  onClose: () => void;
}

export default function ModalViewer({ essay, onClose }: ModalViewerProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: essay.title,
          text: `Check out this essay recommendation: "${essay.title}" by ${essay.author}`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share essay.",
        variant: "destructive",
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60"
        onClick={handleBackdropClick}
        data-testid="modal-backdrop"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            data-testid="modal-content"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-foreground" data-testid="modal-title">
                  {essay.title}
                </h3>
                <p className="text-muted-foreground" data-testid="modal-author">
                  by {essay.author}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose prose-lg max-w-none" data-testid="modal-essay-content">
                {essay.source?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Recommended by <span className="font-medium" data-testid="modal-recommender">
                      {essay.pseudonym || "Anonymous"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground italic" data-testid="modal-why">
                    "{essay.why}"
                  </p>
                </div>
                <Button
                  onClick={handleShare}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
                  data-testid="button-share-essay"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Essay
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
