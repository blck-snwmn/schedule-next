"use server";

import { updateTalents } from "@/services/getData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTalent(formData: FormData) {
	console.log(`id=${formData.get("id")}`);
	console.log(`name=${formData.get("name")}`);
	try {
		await updateTalents(formData.get("id") as string, formData.get("name") as string);
		revalidatePath("/admin/talents");
	} catch (error) {
		return { message: "Failed to update talent" };
	}
	redirect("/admin/talents");
}
