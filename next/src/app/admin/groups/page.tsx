import { GroupList } from "@/components/AdminGroupList";
import { getGroups } from "@/services/getData";

export default async function Group() {
	const groups = await getGroups();
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold tracking-tight">タレント管理</h1>
			</div>
			<GroupList groups={groups} />
		</div>
	);
}
