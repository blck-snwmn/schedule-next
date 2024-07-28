"use client";

import {
	eachDayOfInterval,
	endOfDay,
	endOfMonth,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	isWithinInterval,
	startOfDay,
	startOfMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

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

	const hasEvent = (date: Date) => {
		const dayStart = startOfDay(date);
		const dayEnd = endOfDay(date);
		return events.some((event) =>
			event.schedules.some((schedule) =>
				isSameDay(schedule.startAt, date) || // 開始日が対象日と同じ
				isSameDay(schedule.endAt, date) || // 終了日が対象日と同じ
				isWithinInterval(dayStart, { start: schedule.startAt, end: schedule.endAt }) ||
				isWithinInterval(dayEnd, { start: schedule.startAt, end: schedule.endAt }) ||
				(schedule.startAt <= dayStart && schedule.endAt >= dayEnd)
			)
		);
	};
	const prevMonth = new Date(year, month - 2);
	const nextMonth = new Date(year, month);

	const formatMonth = (date: Date) =>
		(date.getMonth() + 1).toString().padStart(2, "0");

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden text-black mb-5">
			<div className="flex items-center justify-between px-6 py-4 border-b">
				<h2 className="text-xl font-semibold text-gray-800">
					{format(currentDate, "yyyy年 M月", { locale: ja })}
				</h2>
				<div>
					<Link
						href={`/schedule?year=${prevMonth.getFullYear()}&month=${formatMonth(prevMonth)}`}
						className="mr-2"
					>
						前月
					</Link>
					<Link
						href={`/schedule?year=${nextMonth.getFullYear()}&month=${formatMonth(nextMonth)}`}
					>
						翌月
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-7 gap-px bg-gray-200">
				{["日", "月", "火", "水", "木", "金", "土"].map((day) => (
					<div key={day} className="text-center py-2 bg-gray-100">
						{day}
					</div>
				))}
				{daysInMonth.map((day) => (
					<div
						key={day.toString()}
						className={`p-2 bg-white ${!isSameMonth(day, currentDate)
							? "text-gray-400"
							: isToday(day)
								? "bg-blue-100"
								: ""
							}`}
					>
						<span className="text-sm">{format(day, "d")}</span>
						<div className="w-2 h-2 mt-1">
							{hasEvent(day) && (
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
