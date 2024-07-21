
import { getEvents, getTaletns } from '@/services/getData';
import { Events } from '@/components/schedule';
import Link from 'next/link';

export default async function Home() {
    const scheduleEvent = await getEvents();
    const talents = await getTaletns();
    return (
        <Events scheduleEvent={scheduleEvent} talents={talents} />
    );
}
