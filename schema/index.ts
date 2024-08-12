import { z } from "zod";

const talentSchema = z.object({
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
    description: z.string().nullable().optional(),
    thumbnail: z.string().url().nullable().optional(),
    talents: z.array(talentSchema).nonempty("At least one talent is required"),
    schedules: z
        .array(scheduleSchema)
        .nonempty("At least one schedule is required"),
});

export const eventsSchema = z.array(eventSchema);

export const talentsSchema = z.array(talentSchema);

export const updateEventSchema = eventSchema
    .omit({
        talents: true,
    })
    .extend({
        talentIds: z.array(talentSchema.shape.id).nonempty(),
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

type zzz1 = z.infer<typeof updateEventSchema>;
type zzz2 = z.infer<typeof createEventSchema>;
