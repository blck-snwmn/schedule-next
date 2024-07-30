import { Events } from "@/components/schedule";
import { getEvents, getTaletns } from "@/services/getData";
import { isValid, parseISO } from "date-fns";
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

	const paddedMonth = monthStr.padStart(2, "0");

	// FIXME: result is UTC
	const result = parseISO(`${yearStr}-${paddedMonth}-01T00:00:00Z`);
	console.info(yearStr, monthStr, result);
	if (!isValid(result)) {
		notFound();
	}
	const year = result.getFullYear();
	const month = result.getMonth() + 1;

	const [scheduleEvent, talents] = await Promise.all([
		getEvents(year, month),
		getTaletns(),
	]);
	return (
		<Events
			scheduleEvent={scheduleEvent}
			talents={talents}
			year={year}
			month={month}
		/>
	);
}
