import type {
	createEventSchema,
	createGroupSchema,
	eventSchema,
	groupsSchema,
	scheduleEventSchema,
	updateEventSchema,
	updateGroupSchema,
} from "schema";
import type { z } from "zod";

export type Category =
	| "音楽"
	| "ライブ"
	| "メディア"
	| "出版"
	| "ファンイベント"
	| "コラボレーション"
	| "その他";

export const categoryColors: Record<Category, string> = {
	音楽: "bg-blue-500",
	ライブ: "bg-green-500",
	メディア: "bg-purple-500",
	出版: "bg-yellow-500",
	ファンイベント: "bg-pink-500",
	コラボレーション: "bg-indigo-500",
	その他: "bg-gray-500",
};

export const categories: Category[] = Object.keys(categoryColors) as Category[];

export type Group = z.infer<typeof groupsSchema.element>;
export type CreateGroup = z.infer<typeof createGroupSchema>;
export type EditGroup = z.infer<typeof updateGroupSchema>;
export type ScheduleEvent = z.infer<typeof eventSchema>;
export type Schedule = z.infer<typeof eventSchema.shape.schedules.element>;
export type CreateScheduleEvent = z.infer<typeof createEventSchema>;
export type EditScheduleEvent = z.infer<typeof updateEventSchema>;

export type ScheduleWithEvent = z.infer<typeof scheduleEventSchema>;

export type Talent = z.infer<typeof eventSchema.shape.talents.element>;
