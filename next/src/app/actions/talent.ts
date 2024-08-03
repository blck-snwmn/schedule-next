"use server";

import { redirect } from "next/navigation";

export async function updateTalent(formData: FormData) {
	console.log(`id=${formData.get("id")}`);
	console.log(`id=${formData.get("name")}`);
	redirect("/admin/talents");
}
