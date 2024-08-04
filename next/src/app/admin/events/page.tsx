import { EventList } from "@/components/AdminEventList"
import { getEvents } from "@/services/getData"
import { isValid, parseISO } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    searchParams: { year?: string; month?: string };
};

export default async function Event({ searchParams }: Props) {
    // `month` and `year` are obtained from URL parameters
    // If not set as a URL parameter, the current year and month are used.
    const now = new Date();
    const yearStr = searchParams.year || now.getFullYear().toString();
    const monthStr = searchParams.month || (now.getMonth() + 1).toString();

    const paddedMonth = monthStr.padStart(2, "0");

    // FIXME: result is UTC
    const result = parseISO(`${yearStr}-${paddedMonth}-01T00:00:00Z`);
    console.info(yearStr, monthStr, result);
    if (!isValid(result)) {
        notFound();
    }
    const year = result.getFullYear();
    const month = result.getMonth() + 1;

    const prevMonth = new Date(year, month - 2);
    const nextMonth = new Date(year, month);

    const formatMonth = (date: Date) =>
        (date.getMonth() + 1).toString().padStart(2, "0");


    const events = await getEvents(year, month)
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">イベント管理</h1>
            </div>
            <div>
                <Link
                    href={`/admin/events?year=${prevMonth.getFullYear()}&month=${formatMonth(prevMonth)}`}
                    className="mr-2"
                >
                    前月
                </Link>
                <Link
                    href={`/admin/events?year=${now.getFullYear()}&month=${formatMonth(now)}`}
                    className="mr-2"
                >
                    今月
                </Link>
                <Link
                    href={`/admin/events?year=${nextMonth.getFullYear()}&month=${formatMonth(nextMonth)}`}
                >
                    翌月
                </Link>
            </div>
            <EventList events={events} />
        </div>
    )
}