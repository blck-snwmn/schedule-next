import { Events } from "@/components/schedule";
import { getEvents, getTaletns } from "@/services/getData";
import { isValid, parse, parseISO } from "date-fns";
import { notFound } from "next/navigation";

type Props = {
	searchParams: { year?: string; month?: string };
};

export default async function SchedulePage({ searchParams }: Props) {
	// `month` and `year` are obtained from URL parameters
	// If not set as a URL parameter, the current year and month are used. 
	const now = new Date();
	const yearStr = searchParams.year || now.getFullYear().toString();
	const monthStr = searchParams.month || (now.getMonth() + 1).toString();

	// FIXME: result is UTC
	const result = parseISO(`${yearStr}-${monthStr}-01T00:00:00Z`);
	console.info(yearStr, monthStr, result);
	if (!isValid(result)) {
		notFound();
	}
	const year = result.getFullYear();
	const month = result.getMonth() + 1;

	const scheduleEvent = await getEvents(year, month);
	const talents = await getTaletns();
	return <Events scheduleEvent={scheduleEvent} talents={talents} />;
}
