"use server";

import { createTalent, deleteTalent, updateTalent } from "@/services/getData";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createTalentAction(formData: FormData) {
	try {
		await createTalent(
			formData.get("name") as string,
			formData.get("sortKey") as string,
		);
		revalidateTag("talents");
	} catch (error) {
		return { message: "Failed to create talent" };
	}
	redirect("/admin/talents");
}

export async function updateTalentAction(formData: FormData) {
	console.log(`id=${formData.get("id")}`);
	console.log(`name=${formData.get("name")}`);
	try {
		await updateTalent(
			formData.get("id") as string,
			formData.get("name") as string,
			formData.get("sortKey") as string,
		);
		revalidateTag("talents");
	} catch (error) {
		return { message: "Failed to update talent" };
	}
	redirect("/admin/talents");
}

export async function deleteTalentAction(id: string) {
	try {
		await deleteTalent(id);
		revalidateTag("talents");
	} catch (error) {
		return { message: "Failed to delete talent" };
	}
	redirect("/admin/talents");
}
