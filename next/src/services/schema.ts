import { z } from "zod";

const scheduleSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Name is required"),
	startAt: z.string().transform((str) => new Date(str)),
	endAt: z.string().transform((str) => new Date(str)),
});

export const eventFormSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Event name is required"),
	category: z.string().min(1, "Category is required"),
	description: z.string().optional(),
	thumbnail: z.string().url().optional(),
	talentIds: z.array(z.string().uuid()),
	schedules: z
		.array(scheduleSchema)
		.min(1, "At least one schedule is required"),
});
