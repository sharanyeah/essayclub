import { useState } from "react";
import { motion } from "framer-motion";
import NewPostForm from "@/components/NewPostForm";
import MasonryGrid from "@/components/MasonryGrid";
import SuccessToast from "@/components/SuccessToast";
import ModalViewer from "@/components/ModalViewer";
import { BookOpen, Plus, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Essay } from "@shared/schema";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [undoData, setUndoData] = useState<{ essay: Essay; timeoutId: NodeJS.Timeout } | null>(null);
  const [editData, setEditData] = useState<Essay | null>(null);
  const [modalEssay, setModalEssay] = useState<Essay | null>(null);

  const handleFormSubmit = (essay: Essay) => {
    setShowForm(false);
    setEditData(null); // Clear any edit data
    
    // Set up 10-second undo functionality
    const timeoutId = setTimeout(() => {
      setUndoData(null);
    }, 10000);
    
    setUndoData({ essay, timeoutId });
  };

  const handleUndoEdit = () => {
    if (undoData) {
      clearTimeout(undoData.timeoutId);
      setEditData(undoData.essay); // Save essay data for editing
      setUndoData(null); // Clear undo data
      setShowForm(true); // Open form
    }
  };

  const handleUndoDelete = () => {
    if (undoData) {
      clearTimeout(undoData.timeoutId);
      setUndoData(null);
      // The essay will be removed from the grid automatically via React Query invalidation
    }
  };

  const handleCloseUndo = () => {
    if (undoData) {
      clearTimeout(undoData.timeoutId);
      setUndoData(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-background/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BookOpen className="text-primary-foreground w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">The Great Wall of Essays</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1 sm:space-x-2"
                data-testid="button-recommend-essay"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Recommend</span>
                <span className="sm:hidden">Recommend</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">A library of minds</h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-3 sm:mb-4 leading-relaxed max-w-3xl mx-auto">
          Every great essay is a conversation across time. Here, readers share the pieces that stopped them mid-thought, 
          that articulated what they couldn't express, that shifted how they see the world.
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Add to this collection. Share the writing that changed you.
        </p>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Form Section */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto"
          >
            <NewPostForm 
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditData(null); // Clear edit data when cancelling
              }}
              initialData={editData || undefined}
            />
          </motion.div>
        )}

        {/* Essays Grid */}
        <MasonryGrid onOpenModal={setModalEssay} />
      </div>

      {/* Footer */}
      <footer className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-base sm:text-lg italic text-foreground mb-3">
            "Reading is thinking with someone else's head instead of ones own."
          </blockquote>
          <cite className="text-xs sm:text-sm text-muted-foreground">— Arthur Schopenhauer</cite>
         
        </div>
      </footer>

      {/* Success Toast with Edit/Delete */}
      {undoData && (
        <SuccessToast
          essay={undoData.essay}
          onEdit={handleUndoEdit}
          onClose={handleCloseUndo}
        />
      )}

      {/* Modal Viewer */}
      {modalEssay && (
        <ModalViewer
          essay={modalEssay}
          onClose={() => setModalEssay(null)}
        />
      )}
    </div>
  );
}
