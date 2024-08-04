import { EventEditDetail } from "@/components/EventEditDetail";
import { Button } from "@/components/ui/button";
import { getEventById, getTaletns } from "@/services/getData";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: { eventId: string };
};

export default async function EditDetail({ params }: Props) {
	const event = await getEventById(params.eventId);
	if (!event) {
		notFound();
	}
	const talents = await getTaletns();
	return (
		<>
			<Link href="/admin/events">Back to Events</Link>
			<form>
				<EventEditDetail event={event} talents={talents} />
				<Button type="submit">Save Event</Button>
			</form>
		</>
	);
}
