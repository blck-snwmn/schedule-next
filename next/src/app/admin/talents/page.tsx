import { TalentList } from "@/components/AdminTalentList";
import { getTaletns } from "@/services/getData";

export default async function TalentsPage() {
	const talents = await getTaletns();
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold tracking-tight">タレント管理</h1>
			</div>
			<TalentList talents={talents} />
		</div>
	);
}
