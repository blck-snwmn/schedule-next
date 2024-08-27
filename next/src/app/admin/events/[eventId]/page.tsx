import { createEventAction, updateEventAction } from "@/actions/event";
import { EventEditDetail } from "@/app/admin/_components/EventEditDetail";
import { getEventById, getTaletns } from "@/services/getData";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: { eventId: string };
};

export default async function EditDetail({ params }: Props) {
	let event = null;
	if (params.eventId !== "new") {
		// 新規作成
		event = await getEventById(params.eventId);
		if (!event) {
			notFound();
		}
	}
	const ac = params.eventId === "new" ? createEventAction : updateEventAction;

	const talents = await getTaletns();
	return (
		<>
			<Link href="/admin/events">Back to Events</Link>
			<EventEditDetail event={event} talents={talents} serverAction={ac} />
		</>
	);
}
