import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const partnerships = pgTable("partnerships", {
    id: uuid("id").primaryKey().defaultRandom(),
    name1: varchar("name1", { length: 255 }).notNull(),
    email1: varchar("email1", { length: 255 }),
    name2: varchar("name2", { length: 255 }).notNull(),
    email2: varchar("email2", { length: 255 }),
    quote: text("quote"),
    avatar1: text("avatar1"),
    avatar2: text("avatar2"),
    startDate: timestamp("start_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
    id: uuid("id").primaryKey().defaultRandom(),
    partnershipId: uuid("partnership_id")
        .references(() => partnerships.id)
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
