import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const groups = sqliteTable("groups", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
});

export const groupJoinTalents = sqliteTable(
	"group_join_talents",
	{
		groupId: text("group_id")
			.notNull()
			.references(() => groups.id),
		talentId: text("talent_id")
			.notNull()
			.references(() => talents.id),
	},
	(table) => ({
		unq: primaryKey({ columns: [table.groupId, table.talentId] }),
	}),
);

export const talents = sqliteTable("talents", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	sortKey: text("sort_key"), // sortKey is the key used to sort the talents
});

export const events = sqliteTable("events", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	category: text("category").notNull(),
	thumbnail: text("thumbnail"),
});

export const schedules = sqliteTable("schedules", {
	id: text("id").primaryKey(),
	eventId: text("event_id")
		.notNull()
		.references(() => events.id),
	name: text("name").notNull(),
	startAt: integer("start_at", { mode: "timestamp" }).notNull(),
	endAt: integer("end_at", { mode: "timestamp" }).notNull(),
});

export const eventTalents = sqliteTable(
	"event_talents",
	{
		eventId: text("event_id")
			.notNull()
			.references(() => events.id),
		talentId: text("talent_id")
			.notNull()
			.references(() => talents.id),
	},
	(table) => ({
		unq: primaryKey({ columns: [table.eventId, table.talentId] }),
	}),
);
