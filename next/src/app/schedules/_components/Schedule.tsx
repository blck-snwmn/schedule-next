"use client";

import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import type { Schedule, ScheduleWithEvent, Talent } from "@/services/type";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { Header } from "./ScheduleHeader";
import { TalentSelector } from "./TalentSelector";

interface SchedulesProps {
	schedules: ScheduleWithEvent[];
	talents: Talent[];
	year: number;
	month: number;
}

const ScheduleCard: React.FC<{
	schedule: ScheduleWithEvent;
	currentDate: Date;
}> = ({ schedule, currentDate }) => {
	const getScheduleString = (schedule: Schedule) => {
		if (isSameDay(schedule.startAt, schedule.endAt)) {
			return `${format(schedule.startAt, "HH:mm")} - ${format(schedule.endAt, "HH:mm")}`;
		}
		return `${format(schedule.startAt, "M/d HH:mm")} - ${format(schedule.endAt, "M/d HH:mm")}`;
	};

	return (
		<div className={"bg-gray-800 rounded overflow-hidden shadow-lg "}>
			<div className="flex relative">
				<div className="w-1/3 h-32">
					{schedule.event.thumbnail ? (
						<img
							src={schedule.event.thumbnail}
							alt={schedule.event.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
							No Image
						</div>
					)}
					<div className="absolute top-0 left-0 m-1">
						<CategoryBadge category={schedule.event.category} />
					</div>
				</div>
				<div className="w-2/3 p-4">
					<div className="flex justify-between items-start mb-2">
						<h3 className="font-bold text-lg">{schedule.event.name}</h3>
					</div>
					<div>
						<div>{schedule.name}</div>
						<div>{getScheduleString(schedule)}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export const Schedules: React.FC<SchedulesProps> = ({
	schedules,
	talents,
	year,
	month,
}) => {
	const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);

	const filteredEvents = schedules;
	// const filteredEvents = selectedTalent
	// 	? scheduleEvent.filter((event) =>
	// 		event.talents.some((talent) => talent.id === selectedTalent.id),
	// 	)
	// 	: scheduleEvent;

	// イベントを日付でグループ化
	const groupedEvents = filteredEvents.reduce(
		(acc, schedule) => {
			const dateRange = eachDayOfInterval({
				start: schedule.startAt,
				end: schedule.endAt,
			});
			for (const date of dateRange) {
				const dateKey = format(date, "yyyy-MM-dd");
				if (!acc[dateKey]) {
					acc[dateKey] = [];
				}
				acc[dateKey].push(schedule);
			}
			return acc;
		},
		{} as Record<string, ScheduleWithEvent[]>,
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
			{/* {showCalendar && (
				<Calendar events={filteredEvents} year={year} month={month} />
			)} */}
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
									<ScheduleCard
										key={event.id}
										schedule={event}
										currentDate={date}
									/>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};
