import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { events, schedules, talents } from "./schema";

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

export type Schedule = InferSelectModel<typeof schedules>;
export type NewSchedule = InferInsertModel<typeof schedules>;

export type Talent = InferSelectModel<typeof talents>;
export type NewTalent = InferInsertModel<typeof talents>;

export interface EventWithDetails extends Event {
	schedules: Schedule[];
	talents: Talent[];
}

export interface QueryResult {
	id: string;
	name: string;
	description: string | null;
	category: string;
	thumbnail: string | null;
	schedules: Schedule;
	talents: Talent;
}
