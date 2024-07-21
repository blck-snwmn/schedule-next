"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const isEventPast = (event: ScheduleEvent): boolean => {
	return event.schedules.every((schedule) => schedule.status === "past");
};

const ScheduleInfo: React.FC<{ schedule: Schedule }> = ({ schedule }) => (
	<div
		className={`mb-2 p-2 rounded text-sm ${schedule.status === "past" ? "bg-gray-700 text-gray-400" : "bg-gray-800 text-white"}`}
	>
		<div className="flex justify-between items-start">
			<div className="font-semibold">{schedule.name}</div>
			<div className="text-left">
				<div className="text-xs">{formatDate(schedule.start_at)}</div>
				<div className="text-xs">~ {formatDate(schedule.end_at)}</div>
			</div>
		</div>
	</div>
);

const getCategoryColor = (category: string): string => {
	switch (category.toLowerCase()) {
		case "音楽":
			return "blue";
		case "ライブ":
			return "green";
		case "メディア":
			return "purple";
		case "出版":
			return "yellow";
		case "ファンイベント":
			return "pink";
		case "コラボレーション":
			return "indigo";
		default:
			return "gray";
	}
};

const CategoryStripe: React.FC<{ category: string }> = ({ category }) => {
	const colorClass = `bg-${getCategoryColor(category)}-500`;
	return <div className={`w-2 h-full absolute left-0 top-0 ${colorClass}`} />;
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
	const colorClass = `bg-${getCategoryColor(category)}-500`;
	return (
		<span
			className={`${colorClass} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full`}
		>
			{category}
		</span>
	);
};

const EventInfo: React.FC<{ event: ScheduleEvent }> = ({ event }) => {
	const isPast = isEventPast(event);
	return (
		<div
			className={`mb-4 border border-gray-700 rounded overflow-hidden ${isPast ? "bg-gray-800 text-gray-400" : "bg-gray-800 text-white"}`}
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
							<ScheduleInfo key={schedule.id} schedule={schedule} />
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
				className={`px-4 py-2 rounded transition-colors duration-200 ${
					!selectedTalent
						? "bg-blue-600 text-white"
						: "bg-gray-700 text-gray-200 hover:bg-gray-600"
				}`}
				onClick={() => onSelect(null)}
			>
				All
			</button>
			{talents.map((talent) => (
				<button
					key={talent.id}
					className={`px-4 py-2 rounded transition-colors duration-200 ${
						selectedTalent?.id === talent.id
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

const EventList: React.FC<{ events: ScheduleEvent[] }> = ({ events }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{events.map((event) => (
				<EventInfo key={event.id} event={event} />
			))}
		</div>
	);
};

export const Events: React.FC<{
	scheduleEvent: ScheduleEvent[];
	talents: Talent[];
}> = ({ scheduleEvent, talents }) => {
	const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
	const [filteredEvents, setFilteredEvents] =
		useState<ScheduleEvent[]>(scheduleEvent);

	useEffect(() => {
		if (selectedTalent) {
			setFilteredEvents(
				scheduleEvent.filter((event) =>
					event.relatedTalents.some(
						(talent) => talent.id === selectedTalent.id,
					),
				),
			);
		} else {
			setFilteredEvents(scheduleEvent);
		}
	}, [selectedTalent]);

	return (
		<main className="min-h-screen bg-gray-900 text-white p-4">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold mb-6">タレント情報ダッシュボード</h1>
				<TalentSelector
					talents={talents}
					selectedTalent={selectedTalent}
					onSelect={setSelectedTalent}
				/>
				<EventList events={filteredEvents} />
			</div>
		</main>
	);
};
