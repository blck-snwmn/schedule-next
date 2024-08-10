import { createEventSchema, updateEventSchema } from "schema";
import { z } from "zod";

const scheduleSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Name is required"),
	startAt: z.string().transform((str) => new Date(str)),
	endAt: z.string().transform((str) => new Date(str)),
});

// export const eventFormSchema = z.object({
// 	id: z.string().uuid().optional(),
// 	name: z.string().min(1, "Event name is required"),
// 	category: z.string().min(1, "Category is required"),
// 	description: z.string().optional(),
// 	thumbnail: z.string().url().optional(),
// 	talentIds: z.array(z.string().uuid()),
// 	schedules: z
// 		.array(scheduleSchema)
// 		.min(1, "At least one schedule is required"),
// });

// export const eventFormSchema = updateEventSchema.or(createEventSchema);
export const eventFormSchema = createEventSchema
	.merge(updateEventSchema)
	.partial({ id: true });
// export const eventFormSchema = createEventSchema.or(updateEventSchema);
type zzz1 = z.infer<typeof updateEventSchema>;
type zzz2 = z.infer<typeof createEventSchema>;
type zzz3 = z.infer<typeof eventFormSchema>;
