import { createGroupAction, updateGroupAction } from "@/actions/group";
import { GroupEditDetail } from "@/app/admin/_components/GroupEditDetail";
import { getGroupById, getTaletns } from "@/services/getData";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: { groupId: string };
};

export default async function EditDetail({ params }: Props) {
	console.log("group: EditDetail");
	let group = null;
	if (params.groupId !== "new") {
		// 新規作成
		group = await getGroupById(params.groupId);
		if (!group) {
			notFound();
		}
	}
	const ac = params.groupId === "new" ? createGroupAction : updateGroupAction;

	const talents = await getTaletns();
	return (
		<>
			<Link href="/admin/groups">Back to Grops</Link>
			<GroupEditDetail group={group} talents={talents} serverAction={ac} />
		</>
	);
}
