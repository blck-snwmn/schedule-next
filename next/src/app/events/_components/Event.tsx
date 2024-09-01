"use client";

import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import type { Schedule, ScheduleEvent, Talent } from "@/services/type";
import { formatDate } from "@/utils/formatDate";
import {
	eachDayOfInterval,
	endOfMonth,
	format,
	isAfter,
	isBefore,
	isSameMonth,
	isWithinInterval,
	startOfMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import Calendar from "./Calendar";
import { TalentSelector } from "./TalentSelector";

const isScheduleInMonth = (schedule: Schedule, year: number, month: number) => {
	const scheduleStart = schedule.startAt;
	const scheduleEnd = schedule.endAt;
	const monthStart = startOfMonth(new Date(year, month - 1));
	const monthEnd = endOfMonth(new Date(year, month - 1));

	// スケジュールの開始日が月末以前 AND スケジュールの終了日が月初以降
	return (
		(isBefore(scheduleStart, monthEnd) ||
			isSameMonth(scheduleStart, monthStart)) &&
		(isAfter(scheduleEnd, monthStart) || isSameMonth(scheduleEnd, monthStart))
	);
};

const ScheduleInfo: React.FC<{
	schedule: Schedule;
	year: number;
	month: number;
}> = ({ schedule, year, month }) => {
	const isInMonth = isScheduleInMonth(schedule, year, month);
	return (
		<div
			className={`mb-2 p-2 rounded text-sm ${
				isInMonth
					? "bg-gray-700 text-white border-l-4 border-blue-500"
					: "bg-gray-800 text-gray-400"
			}`}
		>
			<div className="flex justify-between items-start">
				<div className="font-semibold">{schedule.name}</div>
				<div className="text-left">
					<div className="text-xs">{formatDate(schedule.startAt)}</div>
					<div className="text-xs">~ {formatDate(schedule.endAt)}</div>
				</div>
			</div>
		</div>
	);
};

const EventInfo: React.FC<{
	event: ScheduleEvent;
	year: number;
	month: number;
}> = ({ event, year, month }) => {
	return (
		<div
			className={
				"mb-4 border border-gray-700 rounded overflow-hidden bg-gray-800 text-white"
			}
		>
			<Link key={event.id} href={`/events/${event.id}`}>
				<div className="h-48 relative bg-gray-700">
					{event.thumbnail ? (
						<img
							src={event.thumbnail}
							alt={event.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-500">
							No Image
						</div>
					)}
					<div className="absolute top-0 left-0 m-2">
						<CategoryBadge category={event.category} />
					</div>
				</div>
				<div className="p-3">
					<h3 className="font-bold text-lg mb-2">{event.name}</h3>
					<div className="mb-2">
						{event.schedules.map((schedule) => (
							<ScheduleInfo
								key={schedule.id}
								schedule={schedule}
								year={year}
								month={month}
							/>
						))}
					</div>
				</div>
			</Link>
		</div>
	);
};

const EventList: React.FC<{
	events: ScheduleEvent[];
	year: number;
	month: number;
}> = ({ events, year, month }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{events.map((event) => (
				<EventInfo key={event.id} event={event} year={year} month={month} />
			))}
		</div>
	);
};

interface EventsProps {
	scheduleEvent: ScheduleEvent[];
	talents: Talent[];
	year: number;
	month: number;
}

const EventCard: React.FC<{ event: ScheduleEvent; currentDate: Date }> = ({
	event,
	currentDate,
}) => {
	const getDateRangeString = (schedules: Schedule[]) => {
		const sortedSchedules = [...schedules].sort(
			(a, b) => a.startAt.getTime() - b.startAt.getTime(),
		);
		const start = sortedSchedules[0].startAt;
		const end = sortedSchedules[sortedSchedules.length - 1].endAt;

		if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
			return `${format(start, "M/d")} ${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
		}
		return `${format(start, "M/d HH:mm")} - ${format(end, "M/d HH:mm")}`;
	};

	const isOngoing = event.schedules.some((schedule) =>
		isWithinInterval(currentDate, {
			start: schedule.startAt,
			end: schedule.endAt,
		}),
	);

	return (
		<div
			className={`bg-gray-800 rounded overflow-hidden shadow-lg mb-4 ${isOngoing ? "border-l-4 border-green-500" : ""}`}
		>
			<div className="p-4">
				<h3 className="font-bold text-lg mb-2">{event.name}</h3>
				<p className="text-sm text-gray-400">
					{getDateRangeString(event.schedules)}
				</p>
			</div>
		</div>
	);
};

export const Events: React.FC<EventsProps> = ({
	scheduleEvent,
	talents,
	year,
	month,
}) => {
	const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);

	const filteredEvents = selectedTalent
		? scheduleEvent.filter((event) =>
				event.talents.some((talent) => talent.id === selectedTalent.id),
			)
		: scheduleEvent;

	// イベントを日付でグループ化
	const groupedEvents = filteredEvents.reduce(
		(acc, event) => {
			for (const schedule of event.schedules) {
				const dateRange = eachDayOfInterval({
					start: schedule.startAt,
					end: schedule.endAt,
				});

				for (const date of dateRange) {
					const dateKey = format(date, "yyyy-MM-dd");
					if (!acc[dateKey]) {
						acc[dateKey] = [];
					}
					if (!acc[dateKey].some((e) => e.id === event.id)) {
						acc[dateKey].push(event);
					}
				}
			}
			return acc;
		},
		{} as Record<string, ScheduleEvent[]>,
	);

	return (
		<main className="min-h-screen bg-gray-900 text-white p-4">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold mb-6">イベント</h1>
				<Button
					onClick={() => setShowCalendar(!showCalendar)}
					className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
				>
					{showCalendar ? "カレンダーを非表示" : "カレンダーを表示"}
				</Button>
				{showCalendar && (
					<Calendar events={filteredEvents} year={year} month={month} />
				)}
				<TalentSelector
					talents={talents}
					selectedTalent={selectedTalent}
					onSelect={setSelectedTalent}
				/>
				<div className="space-y-8 mt-6">
					{Object.entries(groupedEvents).map(([dateKey, events]) => {
						const date = new Date(dateKey);
						return (
							<div key={dateKey} className="flex">
								<div className="w-24 flex-shrink-0 pt-4">
									<div className="text-sm text-gray-400">
										{format(date, "E", { locale: ja })}
									</div>
									<div className="text-lg font-bold">{format(date, "d")}</div>
								</div>
								<div className="flex-grow space-y-4">
									{events.map((event) => (
										<EventCard
											key={event.id}
											event={event}
											currentDate={date}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</main>
	);
};
