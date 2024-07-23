import { Events } from "@/components/schedule";
import { getEvents, getTaletns } from "@/services/getData";
import { isValid, parse } from "date-fns";
import { notFound } from "next/navigation";

type Props = {
	searchParams: { year?: string; month?: string };
};

export default async function SchedulePage({ searchParams }: Props) {
	// `month` and `year` are obtained from URL parameters
	// If not set as a URL parameter, the current year and month are used. 
	const now = new Date();
	const year = searchParams.year || now.getFullYear().toString();
	const month = searchParams.month || (now.getMonth() + 1).toString();

	// FIXME: result is UTC
	const result = parse(`${year}-${month}`, "yyyy-MM", new Date());
	if (!isValid(result)) {
		notFound();
	}

	const scheduleEvent = await getEvents();
	const talents = await getTaletns();
	return <Events scheduleEvent={scheduleEvent} talents={talents} />;
}
