type Status = "active" | "upcoming" | "past";

import type { z } from "zod";
import type { createEventSchema, talentSchema, updateEventSchema } from "schema";


export interface Schedule {
	id: string;
	name: string;
	startAt: Date; // ISO 8601 形式の日時文字列
	endAt: Date; // ISO 8601 形式の日時文字列
	status: Status;
}

export interface ScheduleEvent {
	id: string;
	name: string;
	category: string;
	description?: string;
	thumbnail?: string; // サムネイル画像のURL
	schedules: Schedule[];
	talents: Talent[];
}

// export interface Talent {
// 	id: string;
// 	name: string;
// }

interface AppData {
	talents: Talent[];
	events: ScheduleEvent[];
}

export type CreateScheduleEvent = z.infer<typeof createEventSchema>;
export type EditScheduleEvent = z.infer<typeof updateEventSchema>;
export type Talent = z.infer<typeof talentSchema>;

