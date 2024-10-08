import { getSchedules, getTaletns } from "@/services/getData";
import { isValid, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { Schedules } from "./_components/Schedule";

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

	const [schedules, talents] = await Promise.all([
		getSchedules(year, month),
		getTaletns(),
	]);
	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">イベント</h1>
			<Schedules
				schedules={schedules}
				talents={talents}
				year={year}
				month={month}
			/>
		</div>
	);
}
