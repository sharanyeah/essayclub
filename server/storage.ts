import { type User, type InsertUser, type Essay, type InsertEssay } from "@shared/schema";
import { randomUUID } from "crypto";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";

interface DatabaseSchema {
  essays: Essay[];
  users: User[];
}

// Database setup
const dbPath = path.join(process.cwd(), "db.json");
const adapter = new JSONFile<DatabaseSchema>(dbPath);
const db = new Low(adapter, { essays: [], users: [] });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Essay methods
  getEssays(page?: number, limit?: number): Promise<{ essays: Essay[]; total: number }>;
  getEssay(id: string): Promise<Essay | undefined>;
  createEssay(essay: InsertEssay): Promise<Essay>;
  updateEssay(id: string, essay: Partial<InsertEssay>): Promise<Essay | undefined>;
  deleteEssay(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await db.read();
    } catch (error) {
      console.log("Creating new database file...");
      db.data = { essays: [], users: [] };
      await db.write();
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEssays(page = 1, limit = 20): Promise<{ essays: Essay[]; total: number }> {
    await db.read();
    const essays = db.data?.essays || [];
    
    // Sort by creation date (newest first)
    const sortedEssays = essays.sort((a, b) => b.createdAt - a.createdAt);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEssays = sortedEssays.slice(start, end);
    
    return {
      essays: paginatedEssays,
      total: essays.length
    };
  }

  async getEssay(id: string): Promise<Essay | undefined> {
    await db.read();
    return db.data?.essays?.find(essay => essay.id === id);
  }

  async createEssay(essay: InsertEssay): Promise<Essay> {
    await db.read();
    
    const newEssay: Essay = {
      ...essay,
      id: randomUUID(),
      createdAt: Date.now()
    };

    if (!db.data) {
      db.data = { essays: [], users: [] };
    }
    
    db.data.essays.push(newEssay);
    await db.write();
    
    return newEssay;
  }

  async updateEssay(id: string, essayUpdate: Partial<InsertEssay>): Promise<Essay | undefined> {
    await db.read();
    
    if (!db.data?.essays) return undefined;
    
    const essayIndex = db.data.essays.findIndex(essay => essay.id === id);
    if (essayIndex === -1) return undefined;
    
    const updatedEssay = {
      ...db.data.essays[essayIndex],
      ...essayUpdate
    };
    
    db.data.essays[essayIndex] = updatedEssay;
    await db.write();
    
    return updatedEssay;
  }

  async deleteEssay(id: string): Promise<boolean> {
    await db.read();
    
    if (!db.data?.essays) return false;
    
    const initialLength = db.data.essays.length;
    db.data.essays = db.data.essays.filter(essay => essay.id !== id);
    
    if (db.data.essays.length < initialLength) {
      await db.write();
      return true;
    }
    
    return false;
  }
}

export const storage = new MemStorage();
