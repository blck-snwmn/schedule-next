"use server";

import { deleteEvent } from "@/services/getData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { eventFormSchema } from "@/services/schema";

export async function createEventAction(formData: FormData) {
	try {
		// await createEvent(formData.get("name") as string);
		revalidatePath("/admin/events");
	} catch (error) {
		return { message: "Failed to create event" };
	}
	redirect("/admin/events");
}

export async function updateEventAction(prevState: unknown, formData: FormData) {
	// const scheduleSchema = z.object({
	// 	id: z.string().uuid(),
	// 	name: z.string(),
	// 	startAt: z.string().transform(str => new Date(str)),
	// 	endAt: z.string().transform(str => new Date(str)),
	// });

	// const eventFormSchema = z.object({
	// 	name: z.string(),
	// 	category: z.string(),
	// 	description: z.string().optional(),
	// 	thumbnail: z.string().url().optional(),
	// 	talentIds: z.array(z.string().uuid()),
	// 	schedules: z.array(scheduleSchema)
	// });
	// const zzzzz = Object.fromEntries(formData)
	// console.log(zzzzz)

	const submission = parseWithZod(formData, {
		schema: eventFormSchema,
	});

	if (submission.status !== "success") {
		console.error(submission.error);
		return submission.reply();
	}
	// console.log(result.data);
	// console.log(`id=${formData.get("id")}`);
	// console.log(`name=${formData.get("name")}`);
	// console.log(`talents=${formData.get("talents")}`);
	// console.log(`schedule=${formData.getAll("schedule")}`);
	// for (const pair of formData.entries()) {
	// 	console.log(pair[0] + ", " + pair[1]);
	// }
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
