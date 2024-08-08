"use server";

import { deleteEvent } from "@/services/getData";
import { eventFormSchema } from "@/services/schema";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(
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
	console.info("createEventAction");

	try {
		// await createEvent(formData.get("name") as string);
		revalidatePath("/admin/events");
	} catch (error) {
		console.error(error);
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
		// await updateEvent(
		//     formData.get("id") as string,
		//     formData.get("name") as string,
		// );
		revalidatePath("/admin/events");
	} catch (error) {
		console.error(error);
		// return { message: "Failed to update event" };
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
