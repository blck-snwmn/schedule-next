import { CategoryBadge, getCategoryColor } from "@/components/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ScheduleWithEvent, Talent } from "@/services/type";
import { formatDate } from "@/utils/formatDate";
import {
	eachDayOfInterval,
	format,
	getDay,
	getDaysInMonth,
	isToday,
} from "date-fns";

interface SchedulesProps {
	schedules: ScheduleWithEvent[];
	talents: Talent[];
	year: number;
	month: number;
}
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

const DateCell: React.FC<{ date: Date }> = ({ date }) => {
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
};

const getGridColumnSpan = (range: Date[], schedule: ScheduleWithEvent) => {
	// If you started last month or earlier, adjust `startIndex`.
	let startIndex = range.findIndex((date) => date >= schedule.startAt);
	startIndex = startIndex === -1 ? 0 : startIndex;

	// If it ends next month or later, adjust `endIndex`.
	let endIndex = range.findIndex((date) => date >= schedule.endAt);
	endIndex = endIndex === -1 ? range.length - 1 : endIndex;

	return `${startIndex + 1} / span ${endIndex - startIndex + 1}`;
};

const getBorderRadiusClass = (range: Date[], schedule: ScheduleWithEvent) => {
	const isStartBeforeMonth = schedule.startAt < range[0]; // 開始日が当月より前かどうか
	const isEndAfterMonth = schedule.endAt > range[range.length - 1]; // 終了日が当月より後かどうか

	let borderRadiusClass = "rounded-l-lg rounded-r-lg"; // デフォルトで角丸をすべてつける

	if (isStartBeforeMonth) {
		borderRadiusClass = borderRadiusClass.replace("rounded-l-lg", ""); // 左の角を丸めない
	}

	if (isEndAfterMonth) {
		borderRadiusClass = borderRadiusClass.replace("rounded-r-lg", ""); // 右の角を丸めない
	}
	return borderRadiusClass;
};

const ScheduleCell: React.FC<{
	range: Date[];
	schedule: ScheduleWithEvent;
	index: number;
}> = ({ range, schedule, index }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<div
					key={schedule.id}
					className={cn(
						"p-1 text-center whitespace-nowrap",
						getCategoryColor(schedule.event.category),
						getBorderRadiusClass(range, schedule),
					)}
					style={{
						gridColumn: getGridColumnSpan(range, schedule),
						gridRow: index + 2,
					}}
				>
					{schedule.event.name}: {schedule.name}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<div className="h-48 relative bg-gray-700">
					{schedule.event.thumbnail ? (
						<img
							src={schedule.event.thumbnail}
							alt={schedule.event.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-500">
							No Image
						</div>
					)}
					<div className="absolute top-0 left-0 m-2">
						<CategoryBadge category={schedule.event.category} />
					</div>
				</div>
				<div className="flex flex-row my-1">
					<div className="text-xs">{formatDate(schedule.startAt)}</div>
					<div className="text-xs"> ~ {formatDate(schedule.endAt)}</div>
				</div>
				<div>
					関連
					<div className="flex flex-row flex-wrap gap-1">
						{schedule.event.talents.map((t) => {
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
	);
};

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

	return (
		<div>
			<ScrollArea>
				<div
					className="grid gap-2 mb-5"
					style={{
						gridTemplateColumns: `repeat(${numberOfDays}, minmax(50px, 1fr))`,
					}}
				>
					{range.map((date) => (
						<DateCell date={date} key={date.toISOString()} />
					))}
					{schedules.map((schedule, index) => (
						<ScheduleCell
							range={range}
							schedule={schedule}
							index={index}
							key={schedule.id}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
