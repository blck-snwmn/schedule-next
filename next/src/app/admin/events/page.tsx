import { EventList } from "@/components/AdminEventList"
import { getEvents } from "@/services/getData"

export default async function Event() {
    const events = await getEvents(2024, 7)
    return (
        <EventList events={events} />
    )
}