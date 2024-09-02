"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface EventsProps {
	year: number;
	month: number;
}

export const Header = ({ year, month }: EventsProps) => {
	const currentDate = new Date(year, month - 1, 1);
	const prevMonth = new Date(year, month - 2);
	const nextMonth = new Date(year, month);

	const formatMonth = (date: Date) =>
		(date.getMonth() + 1).toString().padStart(2, "0");
	return (
		<div className="flex items-center justify-between px-6 py-4 border-b">
			<h2 className="text-xl font-semibold ">
				{format(currentDate, "yyyy年 M月", { locale: ja })}
			</h2>
			<div>
				<Link
					href={`/schedules?year=${prevMonth.getFullYear()}&month=${formatMonth(prevMonth)}`}
					className="mr-2"
				>
					前月
				</Link>
				<Link
					href={`/schedules?year=${nextMonth.getFullYear()}&month=${formatMonth(nextMonth)}`}
				>
					翌月
				</Link>
			</div>
		</div>
	);
};
