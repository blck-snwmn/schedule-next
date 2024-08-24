import {
	createEventSchema,
	createGroupSchema,
	updateEventSchema,
	updateGroupSchema,
} from "schema";
import { z } from "zod";

const scheduleSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Name is required"),
	startAt: z.string().transform((str) => new Date(str)),
	endAt: z.string().transform((str) => new Date(str)),
});

export const eventFormSchema = createEventSchema
	.merge(updateEventSchema)
	.partial({ id: true });

export const groupFormSchema = createGroupSchema
	.merge(updateGroupSchema)
	.partial({ id: true });
