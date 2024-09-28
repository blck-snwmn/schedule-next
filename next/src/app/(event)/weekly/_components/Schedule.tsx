import { getCategoryColor } from "@/components/CategoryBadge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ScheduleWithEvent, Talent } from "@/services/type";
import { eachDayOfInterval, format, getDay, getDaysInMonth, isToday } from "date-fns";

interface SchedulesProps {
	schedules: ScheduleWithEvent[];
	talents: Talent[];
	year: number;
	month: number;
}

export const Schedules: React.FC<SchedulesProps> = ({
	schedules,
	talents,
	year,
	month,
}) => {
	const numberOfDays = getDaysInMonth(new Date(year, month - 1));
	const monthStart = new Date(year, month - 1, 1);
	const monthEnd = new Date(year, month, 0);
	const range = eachDayOfInterval({
		start: monthStart,
		end: monthEnd,
	});

	const getGridColumnSpan = (schedule: ScheduleWithEvent) => {
		// If you started last month or earlier, adjust `startIndex`.
		let startIndex = range.findIndex((date) => date >= schedule.startAt);
		startIndex = startIndex === -1 ? 0 : startIndex;

		// If it ends next month or later, adjust `endIndex`.
		let endIndex = range.findIndex((date) => date >= schedule.endAt);
		endIndex = endIndex === -1 ? range.length - 1 : endIndex;

		return `${startIndex + 1} / span ${endIndex - startIndex + 1}`;
	};

	const getDayBackground = (date: Date) => {
		if (isToday(date)) {
			return "border-2 border-yellow-500";
		}
		const dayIndex = getDay(date);
		switch (dayIndex) {
			case 0: // sunday
				return "text-red-500";
			case 6: // saturday
				return "text-blue-500";
			default: // weekday
				return "text-gray-300";
		}
	};

	return (
		<div>
			<ScrollArea>
				<div
					className="grid gap-2 mb-5"
					style={{
						gridTemplateColumns: `repeat(${numberOfDays}, minmax(50px, 1fr))`,
					}}
				>
					{range.map((date) => {
						return (
							<div
								key={date.toISOString()}
								className={cn(
									"text-center p-2 rounded-lg shadow-sm",
									getDayBackground(date),
								)}
							>
								<div className="text-xs font-semibold text-gray-400">
									{format(date, "EEE")} {/* 曜日 */}
								</div>
								<div className="text-lg font-bold">{format(date, "dd")}</div>
							</div>
						);
					})}
					{schedules.map((schedule, index) => (
						<div
							key={schedule.id}
							className={cn(
								"p-1 rounded-lg text-center whitespace-nowrap",
								getCategoryColor(schedule.event.category),
							)}
							style={{
								gridColumn: getGridColumnSpan(schedule),
								gridRow: index + 2,
							}}
						>
							{schedule.event.name}: {schedule.name}
						</div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
