"use server";

import { createGroup, deleteGroup, updateGroup } from "@/services/getData";
import { parseWithZod } from "@conform-to/zod";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createGroupSchema, updateGroupSchema } from "schema";

export async function createGroupAction(
	prevState: unknown,
	formData: FormData,
) {
	console.log("zzzzzz");

	const submission = parseWithZod(formData, {
		schema: createGroupSchema,
	});
	console.log("submission", submission.status);

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("createGroup");
	console.log("talentIds:", submission.value.talentIds);

	try {
		await createGroup(submission.value);
		revalidateTag("groups");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ["Failed to create group"],
		});
	}
	redirect("/admin/groups");
}

export async function updateGroupAction(
	prevState: unknown,
	formData: FormData,
) {
	console.log("zzzzzz");
	console.log(formData);

	const submission = parseWithZod(formData, {
		schema: updateGroupSchema,
	});

	if (submission.status !== "success") {
		console.error("error", submission.error);
		return submission.reply();
	}
	console.info("updateGroupAction");
	console.log("talentIds:", submission.value.talentIds);

	try {
		await updateGroup(submission.value);
		revalidateTag(`groups?groupId=${submission.value.id}`);
		revalidateTag("groups");
	} catch (error) {
		console.error(error);
		return submission.reply({
			formErrors: ["Failed to update group"],
		});
	}
	redirect("/admin/groups");
}

export async function deleteGroupAction(id: string) {
	console.log("deleteGroupAction");
	try {
		await deleteGroup(id);
		revalidateTag("groups");
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete group");
	}
	redirect("/admin/groups");
}
