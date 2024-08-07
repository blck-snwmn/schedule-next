import { z } from "zod";

const scheduleSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	startAt: z.string().transform((str) => new Date(str)),
	endAt: z.string().transform((str) => new Date(str)),
	// status: z.enum(['active', 'upcoming', 'past'])
});

export const eventFormSchema = z.object({
	name: z.string(),
	category: z.string(),
	description: z.string().optional(),
	thumbnail: z.string().url().optional(),
	talentIds: z.array(z.string()),
	schedules: z.array(scheduleSchema),
});
