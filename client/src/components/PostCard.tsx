import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Eye, Link, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Essay } from "@shared/schema";

interface PostCardProps {
  essay: Essay;
  onOpenModal: (essay: Essay) => void;
  index: number;
}

export default function PostCard({ essay, onOpenModal, index }: PostCardProps) {
  const isUrl = (str: string | undefined): boolean => {
    if (!str || str.trim() === '') return false;
    
    const trimmed = str.trim();
    
    // Must start with http:// or https:// to be considered a URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        new URL(trimmed);
        return true;
      } catch {
        return false;
      }
    }
    
    // Or be a clear domain pattern (like example.com, www.example.com)
    const domainPattern = /^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(\/.*)?$/;
    if (domainPattern.test(trimmed)) {
      try {
        new URL(`https://${trimmed}`);
        return true;
      } catch {
        return false;
      }
    }
    
    // Everything else is text content
    return false;
  };

  const getSourceTypeIcon = () => {
    if (!essay.source || essay.source.trim() === '') {
      return <FileText className="w-3 h-3 mr-1" />;
    }
    const hasUrl = isUrl(essay.source);
    if (hasUrl) {
      return <Link className="w-3 h-3 mr-1" />;
    } else {
      return <FileText className="w-3 h-3 mr-1" />;
    }
  };

  const getSourceTypeBadgeClass = () => {
    if (!essay.source || essay.source.trim() === '') {
      return "bg-muted text-muted-foreground";
    }
    const hasUrl = isUrl(essay.source);
    if (hasUrl) {
      return "bg-accent text-accent-foreground";
    } else {
      return "bg-muted text-muted-foreground";
    }
  };

  const handleOpenLink = () => {
    if (essay.source && isUrl(essay.source)) {
      try {
        const url = essay.source.startsWith("http") ? essay.source : `https://${essay.source}`;
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }
  };

  const handleOpenModal = () => {
    if (essay.source && !isUrl(essay.source)) {
      onOpenModal(essay);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-hover fade-in break-inside-avoid"
      style={{ marginBottom: '1.5rem' }}
      data-testid={`card-essay-${essay.id}`}
    >
        <div
          className="
            bg-card rounded-lg p-4 shadow-sm border border-border
            hover:shadow-lg hover:-translate-y-1
            transition-all duration-300 ease-in-out
          "
        >
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-2" data-testid={`text-title-${essay.id}`}>
            {essay.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-1">
            by <span className="font-medium" data-testid={`text-author-${essay.id}`}>{essay.author}</span>
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span data-testid={`text-pseudonym-${essay.id}`}>
              {essay.pseudonym || "Anonymous"}
            </span>
            <span>•</span>
            <span data-testid={`text-date-${essay.id}`}>
              {formatDistanceToNow(new Date(essay.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <p className="text-foreground text-xs sm:text-sm leading-relaxed mb-4" data-testid={`text-why-${essay.id}`}>
          {essay.why}
        </p>

        {/* Read Here box for text content */}
        {essay.source && !isUrl(essay.source) && (
          <div className="bg-accent/50 border border-accent rounded-lg p-3 sm:p-4 mb-4 cursor-pointer hover:bg-accent/60 transition-colors group" onClick={handleOpenModal}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">Read Here</span>
              </div>
              <Eye className="w-4 h-4 text-accent-foreground group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-accent-foreground/70 mt-2">Click to view the full text content</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getSourceTypeBadgeClass()}`}>
              {getSourceTypeIcon()}
              {!essay.source || essay.source.trim() === '' ? "No Source" : (isUrl(essay.source) ? "Link" : "Text")}
            </span>
          </div>

          <div className="flex space-x-2">
            {essay.source && essay.source.trim() !== '' && isUrl(essay.source) ? (
              <Button
                onClick={handleOpenLink}
                className="bg-primary text-primary-foreground px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-primary/90 transition-all flex items-center space-x-1"
                data-testid={`button-read-now-${essay.id}`}
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Read Now</span>
              </Button>
            ) : !essay.source || essay.source.trim() === '' ? (
              <span className="text-xs text-muted-foreground italic px-2 sm:px-3 py-1 sm:py-1.5">No source provided</span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
