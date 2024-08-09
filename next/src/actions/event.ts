"use server";

import { createEvent, deleteEvent, updateEvent } from "@/services/getData";
import { eventFormSchema } from "@/services/schema";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(
	prevState: unknown,
	formData: FormData,
) {
	console.log("zzzzzz");
	// console.log(formData);

	const submission = parseWithZod(formData, {
		schema: eventFormSchema,
	});
	// console.log("submission", submission.status);

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("createEventAction");
	console.log('talentIds:', submission.value.talentIds);

	try {
		await createEvent({
			name: submission.value.name,
			category: submission.value.category,
			description: submission.value.description,
			thumbnail: submission.value.thumbnail,
			schedules: submission.value.schedules.map((schedule) => ({
				id: schedule.id ?? "",
				name: schedule.name,
				startAt: schedule.startAt,
				endAt: schedule.endAt,
				status: "active",
			})),
			talentIds: submission.value.talentIds,
		});
		revalidatePath("/admin/events");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ['Failed to create event'],
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
		schema: eventFormSchema,
	});
	console.log("submission", submission.status);

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("updateEventAction");
	try {
		await updateEvent({
			id: submission.value.id ?? "", // FIXME: id is required
			name: submission.value.name,
			category: submission.value.category,
			description: submission.value.description,
			thumbnail: submission.value.thumbnail,
			schedules: submission.value.schedules.map((schedule) => ({
				id: schedule.id,
				name: schedule.name,
				startAt: schedule.startAt,
				endAt: schedule.endAt,
				status: "active",
			})),
			talentIds: submission.value.talentIds,
		});
		revalidatePath("/admin/events");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ['Failed to edit event'],
		});
	}
	redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
	console.info(`deleteEventAction: id=${id}`);
	try {
		await deleteEvent(id);
		revalidatePath("/admin/events");
	} catch (error) {
		return { message: "Failed to delete event" };
	}
	redirect("/admin/events");
}
