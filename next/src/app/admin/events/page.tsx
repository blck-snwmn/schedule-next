import { EventList } from "@/components/AdminEventList"
import { getEvents } from "@/services/getData"

export default async function Event() {
    const events = await getEvents(2024, 7)
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">イベント管理</h1>
            </div>
            <EventList events={events} />
        </div>
    )
}