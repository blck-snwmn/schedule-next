import { createEventAction, updateEventAction } from "@/actions/event";
import { EditDetailDialog } from "@/components/EventEditDetailDialog";
import { getEventById, getTaletns } from "@/services/getData";
import { notFound } from "next/navigation";

type Props = {
	params: { eventId: string };
};

export default async function EditDetail({ params }: Props) {
	let event = null;
	if (params.eventId !== "new") {
		event = await getEventById(params.eventId);
		if (!event) {
			notFound();
		}
	}
	const ac = params.eventId === "new" ? createEventAction : updateEventAction;

	const talents = await getTaletns();
	return <EditDetailDialog event={event} talents={talents} serverAction={ac} />;
}
