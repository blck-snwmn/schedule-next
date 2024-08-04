"use server";

import { deleteEvent } from "@/services/getData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(formData: FormData) {
	try {
		// await createEvent(formData.get("name") as string);
		revalidatePath("/admin/events");
	} catch (error) {
		return { message: "Failed to create event" };
	}
	redirect("/admin/events");
}

export async function updateEventAction(formData: FormData) {
	console.log(`id=${formData.get("id")}`);
	console.log(`name=${formData.get("name")}`);
	try {
		// await updateEvent(
		//     formData.get("id") as string,
		//     formData.get("name") as string,
		// );
		revalidatePath("/admin/events");
	} catch (error) {
		return { message: "Failed to update event" };
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
