"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ScheduleEvent } from "@/services/type";
import { useRouter } from "next/navigation";
import { EventDetail } from "./EventDetail";

type Props = {
	event: ScheduleEvent;
};

export default function DetailDialog({ event }: Props) {
	const router = useRouter(); // required "use client"
	return (
		<Dialog open={true} onOpenChange={() => router.back()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{event.name}</DialogTitle>
				</DialogHeader>
				<EventDetail event={event} />
			</DialogContent>
		</Dialog>
	);
}
