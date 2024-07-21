

import { EventDetail } from "@/components/event-detail"
import DetailDialog from "@/components/event-detail-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getEventById } from "@/services/getData"
import { notFound, useRouter } from "next/navigation"

type Props = {
    params: { eventId: string }
}
export default async function Detail({ params }: Props) {
    // const router = useRouter(); // required "use client"
    const event = await getEventById(params.eventId);
    if (!event) {
        notFound();
    }
    return (
        <DetailDialog event={event} />
    )
}