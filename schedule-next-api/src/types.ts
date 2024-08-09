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

type OptinalSchedule = Omit<Schedule, 'id'> & { id?: string; };

export type EditScheduleEvent = Omit<EventWithDetails, 'id' | "talents" | "schedules"> & {
	talentIds: string[];
	schedules: OptinalSchedule[];
};


export type CreateEvent = Omit<EventWithDetails, 'id' | 'talents'> & {
	talentIds: string[];
}

// export type CreateEvent = Omit<Event/WithDetails, 'id' | 'talents'>

export interface QueryResult {
	id: string;
	name: string;
	description: string | null;
	category: string;
	thumbnail: string | null;
	schedules: Schedule;
	talents: Talent;
}
