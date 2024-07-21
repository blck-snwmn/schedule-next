import DetailDialog from "@/components/event-detail-dialog";
import { getEventById } from "@/services/getData";
import { notFound } from "next/navigation";

type Props = {
	params: { eventId: string };
};
export default async function Detail({ params }: Props) {
	const event = await getEventById(params.eventId);
	if (!event) {
		notFound();
	}
	return <DetailDialog event={event} />;
}
