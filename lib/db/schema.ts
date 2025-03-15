import { pgTable, serial, text, varchar, uuid } from "drizzle-orm/pg-core";

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
});

export const clues = pgTable("clues", {
  id: serial("id").primaryKey(),
  destinationId: serial("destination_id").references(() => destinations.id).notNull(),
  clue: text("clue").notNull(),
});

export const funFacts = pgTable("fun_facts", {
  id: serial("id").primaryKey(),
  destinationId: serial("destination_id").references(() => destinations.id).notNull(),
  fact: text("fact").notNull(),
});

export const trivia = pgTable("trivia", {
  id: serial("id").primaryKey(),
  destinationId: serial("destination_id").references(() => destinations.id).notNull(),
  fact: text("fact").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  score: serial("score").default(0).notNull(),
  correctAnswers: serial("correct_answers").default(0).notNull(),
  totalAnswers: serial("total_answers").default(0).notNull(),
  createdAt: varchar("created_at").notNull().default(new Date().toISOString()),
});