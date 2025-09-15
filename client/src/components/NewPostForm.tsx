import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { insertEssaySchema, type InsertEssay, type Essay } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, Heart, Globe, VenetianMask, Send, X } from "lucide-react";

interface NewPostFormProps {
  onSubmit: (essay: Essay) => void;
  onCancel: () => void;
  initialData?: Essay;
}

export default function NewPostForm({ onSubmit, onCancel, initialData }: NewPostFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertEssay>({
    resolver: zodResolver(insertEssaySchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      why: initialData?.why || "",
      source: initialData?.source || undefined,
      pseudonym: initialData?.pseudonym || "",
    },
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        author: initialData.author,
        why: initialData.why,
        source: initialData.source || undefined,
        pseudonym: initialData.pseudonym || "",
      });
    }
  }, [initialData, form]);

  const createEssayMutation = useMutation({
    mutationFn: async (data: InsertEssay) => {
      const response = await apiRequest("POST", "/api/essays", data);
      return response.json();
    },
    onSuccess: (essay: Essay) => {
      queryClient.invalidateQueries({ queryKey: ["/api/essays"] });
      onSubmit(essay);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit essay recommendation. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create essay:", error);
    },
  });

  const updateEssayMutation = useMutation({
    mutationFn: async (data: InsertEssay) => {
      if (!initialData) throw new Error("No initial data for update");
      const response = await apiRequest("PUT", `/api/essays/${initialData.id}`, data);
      return response.json();
    },
    onSuccess: (essay: Essay) => {
      queryClient.invalidateQueries({ queryKey: ["/api/essays"] });
      onSubmit(essay);
      form.reset();
      toast({
        title: "Essay updated!",
        description: "Your recommendation has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update essay recommendation. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update essay:", error);
    },
  });

  const handleSubmit = (data: InsertEssay) => {
    if (initialData) {
      updateEssayMutation.mutate(data);
    } else {
      createEssayMutation.mutate(data);
    }
  };

  const isLoading = createEssayMutation.isPending || updateEssayMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        bg-card rounded-lg p-4 sm:p-6 lg:p-8 border border-border mx-2 sm:mx-0
        shadow-sm hover:shadow-lg hover:-translate-y-1
        dark:hover:drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)]
        transition-all duration-300 ease-in-out
      "
    >

      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
          Recommend an Essay
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">Share a piece of writing that moved you</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 sm:space-y-8">
          {/* Title Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="form-field group"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-xl font-semibold text-foreground mb-4">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Title of the essay
                  </FormLabel>
                 
                  <FormControl>
                    <Input
                      placeholder="Enter the exact title of the essay you want to recommend."
                      className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base py-4 px-4 rounded-lg shadow-sm hover:shadow-md"
                      data-testid="input-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Author Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="form-field group"
          >
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-xl font-semibold text-foreground mb-4">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Author
                  </FormLabel>
                 
                  <FormControl>
                    <Input
                      placeholder="Who wrote this piece? Add their name so others can explore more of their work."
                      className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base py-4 px-4 rounded-lg shadow-sm hover:shadow-md"
                      data-testid="input-author"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Why Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="form-field group"
          >
            <FormField
              control={form.control}
              name="why"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-xl font-semibold text-foreground mb-4">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Why it belongs here
                  </FormLabel>
                  
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Did this essay shift the way you see the world? Capture something you'd always felt but never expressed? Or simply contain a line you can't get out of your head? Tell us why it matters, and why you think others should read it too."
                      className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none text-base py-4 px-4 rounded-lg shadow-sm hover:shadow-md"
                      data-testid="textarea-why"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Source Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="form-field group"
          >
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-xl font-semibold text-foreground mb-4">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Where can we find it?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Enter a URL link (https://example.com/essay) if it's online, or tell us where we can find it in print. If you're sharing a text snippet, paste it here."
                      className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base py-4 px-4 rounded-lg shadow-sm hover:shadow-md resize-none"
                      data-testid="textarea-source"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Pseudonym Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="form-field group"
          >
            <FormField
              control={form.control}
              name="pseudonym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-xl font-semibold text-foreground mb-4">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How would you like to be credited?
                  </FormLabel>
                  
                  <FormControl>
                    <Input
                      placeholder="You can use your real name, a pseudonym, or leave it blank to stay anonymous."
                      className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base py-4 px-4 rounded-lg shadow-sm hover:shadow-md"
                      data-testid="input-pseudonym"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8"
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-lg sm:text-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              data-testid="button-submit-form"
            >
              <Send className="w-5 h-5 mr-2" />
              {isLoading ? "Submitting..." : "Submit Recommendation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-3 text-base"
              data-testid="button-cancel-form"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
