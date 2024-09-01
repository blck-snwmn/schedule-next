"use client";

import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import type { Schedule, ScheduleEvent, Talent } from "@/services/type";
import {
	eachDayOfInterval,
	format,
	isSameMonth,
	isWithinInterval,
} from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import Calendar from "./Calendar";
import { Header } from "./ScheduleHeader";
import { TalentSelector } from "./TalentSelector";


interface SchedulesProps {
	scheduleEvent: ScheduleEvent[];
	talents: Talent[];
	year: number;
	month: number;
}

const ScheduleCard: React.FC<{ event: ScheduleEvent; currentDate: Date }> = ({
	event,
	currentDate,
}) => {
	const relevantSchedules = event.schedules.filter(
		(schedule) =>
			isSameMonth(schedule.startAt, currentDate) ||
			isSameMonth(schedule.endAt, currentDate),
	);

	const getScheduleString = (schedule: Schedule) => {
		if (isSameMonth(schedule.startAt, schedule.endAt)) {
			return `${format(schedule.startAt, "HH:mm")} - ${format(schedule.endAt, "HH:mm")}`;
		}
		return `${format(schedule.startAt, "M/d HH:mm")} - ${format(schedule.endAt, "M/d HH:mm")}`;
	};

	const isOngoing = relevantSchedules.some((schedule) =>
		isWithinInterval(currentDate, {
			start: schedule.startAt,
			end: schedule.endAt,
		}),
	);

	return (
		<div
			className={`bg-gray-800 rounded overflow-hidden shadow-lg ${isOngoing ? "border-l-4 border-green-500" : ""}`}
		>
			<div className="flex">
				<div className="w-1/3 h-32">
					{event.thumbnail ? (
						<img
							src={event.thumbnail}
							alt={event.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
							No Image
						</div>
					)}
				</div>
				<div className="w-2/3 p-4">
					<div className="flex justify-between items-start mb-2">
						<h3 className="font-bold text-lg">{event.name}</h3>
						<CategoryBadge category={event.category} />
					</div>
					{relevantSchedules.map((schedule, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<p key={index} className="text-sm text-gray-400">
							{getScheduleString(schedule)}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};
export const Schedules: React.FC<SchedulesProps> = ({
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
		<main className="min-h-screen">
			<Header year={year} month={month} />
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
									<ScheduleCard key={event.id} event={event} currentDate={date} />
								))}
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};
