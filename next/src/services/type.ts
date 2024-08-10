import type {
	createEventSchema,
	eventSchema,
	talentSchema,
	updateEventSchema,
} from "schema";
import type { z } from "zod";

export type ScheduleEvent = z.infer<typeof eventSchema>;
export type CreateScheduleEvent = z.infer<typeof createEventSchema>;
export type EditScheduleEvent = z.infer<typeof updateEventSchema>;
export type Talent = z.infer<typeof talentSchema>;
