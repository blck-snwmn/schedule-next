import { Events } from "@/components/schedule";
import { getEvents, getTaletns } from "@/services/getData";

export default async function SchedulePage() {
	const scheduleEvent = await getEvents();
	const talents = await getTaletns();
	return <Events scheduleEvent={scheduleEvent} talents={talents} />;
}
