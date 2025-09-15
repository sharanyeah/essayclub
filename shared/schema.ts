import { z } from "zod";

export const insertEssaySchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  why: z.string().min(1, "Please explain why you recommend this essay"),
  source: z.string().optional(),
  pseudonym: z.string().optional(),
});

export type InsertEssay = z.infer<typeof insertEssaySchema>;

export interface Essay extends InsertEssay {
  id: string;
  createdAt: number;
  sourceType?: "link" | "text" | "both"; // Keep for backward compatibility
}

// User schema (keeping existing for compatibility)
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  password: string;
};
