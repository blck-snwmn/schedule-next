import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const talents = sqliteTable('talents', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
});

export const events = sqliteTable('events', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category').notNull(),
    thumbnail: text('thumbnail'),
});

export const schedules = sqliteTable('schedules', {
    id: text('id').primaryKey(),
    eventId: integer('event_id').notNull().references(() => events.id),
    name: text('name').notNull(),
    startAt: integer('start_at', { mode: "timestamp_ms" }).notNull(),
    endAt: integer('end_at', { mode: "timestamp_ms" }).notNull(),
});

export const eventTalents = sqliteTable('event_talents', {
    eventId: integer('event_id').notNull().references(() => events.id),
    talentId: integer('talent_id').notNull().references(() => talents.id),
}, (table) => ({
    unq: primaryKey({ columns: [table.eventId, table.talentId] }),
}))