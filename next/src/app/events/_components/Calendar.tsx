"use client";

import type { ScheduleEvent } from "@/services/type";
import { hasEvent } from "@/utils/eventUtils";
import {
	eachDayOfInterval,
	endOfMonth,
	format,
	isSameMonth,
	isToday,
	startOfMonth,
} from "date-fns";
import type React from "react";

interface CalendarProps {
	year: number;
	month: number;
	events: ScheduleEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events, year, month }) => {
	const currentDate = new Date(year, month - 1, 1);
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden text-black mb-5">
			<div className="grid grid-cols-7 gap-px bg-gray-200">
				{["日", "月", "火", "水", "木", "金", "土"].map((day) => (
					<div key={day} className="text-center py-2 bg-gray-100">
						{day}
					</div>
				))}
				{daysInMonth.map((day) => (
					<div
						key={day.toString()}
						className={`p-2 bg-white ${
							!isSameMonth(day, currentDate)
								? "text-gray-400"
								: isToday(day)
									? "bg-blue-100"
									: ""
						}`}
					>
						<span className="text-sm">{format(day, "d")}</span>
						<div className="w-2 h-2 mt-1">
							{hasEvent(day, events) && (
								<div className="w-full h-full bg-blue-500 rounded-full" />
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;
