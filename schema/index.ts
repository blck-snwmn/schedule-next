import { z } from "zod";

export const talentSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Name is required"),
});

const scheduleSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Name is required"),
	startAt: z.string().transform((str) => new Date(str)),
	endAt: z.string().transform((str) => new Date(str)),
});

export const eventSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Event name is required"),
	category: z.string().min(1, "Category is required"),
	description: z.string().nullable(),
	thumbnail: z.string().url().nullable(),
	talents: z.array(talentSchema),
	schedules: z
		.array(scheduleSchema)
		.min(1, "At least one schedule is required"),
});

export const eventsSchema = z.array(eventSchema);

export const talentsSchema = eventSchema.shape.talents;

export const updateEventSchema = eventSchema
	.omit({
		talents: true,
	})
	.extend({
		talentIds: z.array(talentSchema.shape.id),
		schedules: z.array(
			scheduleSchema.partial({
				id: true,
			}),
		),
	});

export const createEventSchema = updateEventSchema
	.omit({
		id: true,
	})
	.extend({
		schedules: z.array(
			scheduleSchema.omit({
				id: true,
			}),
		),
	});

type zzz = z.infer<typeof createEventSchema>;
