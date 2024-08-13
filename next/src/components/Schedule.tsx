"use client";

import type { Schedule, ScheduleEvent, Talent } from "@/services/type";
import { formatDate } from "@/utils/formatDate";
import {
	endOfMonth,
	isAfter,
	isBefore,
	isSameMonth,
	startOfMonth,
} from "date-fns";
import Link from "next/link";
import { useState } from "react";
import Calendar from "./Calendar";
import { CategoryBadge } from "./CategoryBadge";

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
			className={`mb-2 p-2 rounded text-sm ${isInMonth ? "bg-gray-800 text-white" : "bg-gray-600 text-gray-400" // グレーアウト
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
			<Link key={event.id} href={`/schedule/${event.id}`}>
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

const TalentSelector: React.FC<{
	talents: Talent[];
	selectedTalent: Talent | null;
	onSelect: (talent: Talent | null) => void;
}> = ({ talents, selectedTalent, onSelect }) => {
	return (
		<div className="flex flex-wrap mb-4 gap-2">
			<button
				type="button"
				className={`px-4 py-2 rounded transition-colors duration-200 ${!selectedTalent
						? "bg-blue-600 text-white"
						: "bg-gray-700 text-gray-200 hover:bg-gray-600"
					}`}
				onClick={() => onSelect(null)}
			>
				All
			</button>
			{talents.map((talent) => (
				<button
					type="button"
					key={talent.id}
					className={`px-4 py-2 rounded transition-colors duration-200 ${selectedTalent?.id === talent.id
							? "bg-blue-600 text-white"
							: "bg-gray-700 text-gray-200 hover:bg-gray-600"
						}`}
					onClick={() => onSelect(talent)}
				>
					{talent.name}
				</button>
			))}
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

export const Events: React.FC<{
	scheduleEvent: ScheduleEvent[];
	talents: Talent[];
	year: number;
	month: number;
}> = ({ scheduleEvent, talents, year, month }) => {
	const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
	const filteredEvents = selectedTalent
		? scheduleEvent.filter((event) =>
			event.talents.some((talent) => talent.id === selectedTalent.id),
		)
		: scheduleEvent;

	return (
		<main className="min-h-screen bg-gray-900 text-white p-4">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold mb-6">イベント情報ダッシュボード</h1>
				<Calendar events={filteredEvents} year={year} month={month} />
				<TalentSelector
					talents={talents}
					selectedTalent={selectedTalent}
					onSelect={setSelectedTalent}
				/>
				<EventList events={filteredEvents} year={year} month={month} />
			</div>
		</main>
	);
};
