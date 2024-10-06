"use client";

import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import type { Schedule, ScheduleEvent, Talent } from "@/services/type";
import { formatDate } from "@/utils/formatDate";
import {
	endOfMonth,
	isAfter,
	isBefore,
	isSameMonth,
	startOfMonth,
} from "date-fns";
import { useState } from "react";
import Calendar from "./Calendar";
import { Header } from "./EventHeader";
import { TalentSelector } from "./TalentSelector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
			className={`mb-2 p-2 rounded text-sm ${isInMonth
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
			<h3 className="font-bold text-lg m-1">{event.name}</h3>
			<div className="flex gap-2 m-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button>
							スケジュール
						</Button>
					</PopoverTrigger>
					<PopoverContent className="bg-gray-800">
						<div className="text-white">
							スケジュール
							<div>
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
					</PopoverContent>
				</Popover>
				<Popover>
					<PopoverTrigger asChild>
						<Button>
							関連
						</Button>
					</PopoverTrigger>
					<PopoverContent className="bg-gray-800">
						<div className="text-white">
							関連
							<div className="flex flex-row flex-wrap gap-1">
								{event.talents.map((t) => {
									return (
										<div key={t.id}>
											<Badge>{t.name}</Badge>
										</div>
									);
								})}
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
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

	return (
		<main>
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
			<EventList events={filteredEvents} year={year} month={month} />
		</main>
	);
};
