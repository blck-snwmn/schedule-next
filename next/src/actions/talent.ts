"use server";

import { deleteTalent, updateTalent } from "@/services/getData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTalentAction(formData: FormData) {
	console.log(`id=${formData.get("id")}`);
	console.log(`name=${formData.get("name")}`);
	try {
		await updateTalent(
			formData.get("id") as string,
			formData.get("name") as string,
		);
		revalidatePath("/admin/talents");
	} catch (error) {
		return { message: "Failed to update talent" };
	}
	redirect("/admin/talents");
}

export async function deleteTalentAction(id: string) {
	try {
		await deleteTalent(id);
		revalidatePath("/admin/talents");
	} catch (error) {
		return { message: "Failed to delete talent" };
	}
	redirect("/admin/talents");
}
