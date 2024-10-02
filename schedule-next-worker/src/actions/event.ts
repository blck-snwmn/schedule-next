"use server";

import { createEvent, deleteEvent, updateEvent } from "@/services/getData";
import { parseWithZod } from "@conform-to/zod";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createEventSchema, updateEventSchema } from "schema";

export async function createEventAction(
	prevState: unknown,
	formData: FormData,
) {
	console.log("zzzzzz");
	// console.log(formData);

	const submission = parseWithZod(formData, {
		schema: createEventSchema,
	});
	// console.log("submission", submission.status);

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("createEventAction");
	console.log("talentIds:", submission.value.talentIds);

	try {
		await createEvent(submission.value);
		revalidateTag("events");
		revalidateTag("schedules");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ["Failed to create event"],
		});
	}
	redirect("/admin/events");
}

export async function updateEventAction(
	prevState: unknown,
	formData: FormData,
) {
	console.log("zzzzzz");
	console.log(formData);

	const submission = parseWithZod(formData, {
		schema: updateEventSchema,
	});
	console.log("submission", submission.status);

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("updateEventAction");
	if (!submission.value.id) {
		console.error("id is required");
		return submission.reply({
			formErrors: ["Failed to edit event"],
		});
	}
	try {
		await updateEvent(submission.value);
		revalidateTag(`events?eventId=${submission.value.id}`);
		revalidateTag("events");
		revalidateTag("schedules");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ["Failed to edit event"],
		});
	}
	redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
	console.info(`deleteEventAction: id=${id}`);
	try {
		await deleteEvent(id);
		revalidateTag("events");
		revalidateTag("schedules");
	} catch (error) {
		return { message: "Failed to delete event" };
	}
	redirect("/admin/events");
}
