import { addDays, isWithinInterval } from "date-fns";

export const hasEvent = (date: Date, events: ScheduleEvent[]) => {
	const dayStart = date; // Use the timezone as is. And all hours, minutes and seconds are 0.
	const dayEnd = addDays(dayStart, 1);

	return events.some((event) =>
		event.schedules.some(
			(schedule) =>
				isWithinInterval(schedule.startAt, { start: dayStart, end: dayEnd }) ||
				isWithinInterval(schedule.endAt, { start: dayStart, end: dayEnd }) ||
				isWithinInterval(dayStart, {
					start: schedule.startAt,
					end: schedule.endAt,
				}) || //
				isWithinInterval(dayEnd, {
					start: schedule.startAt,
					end: schedule.endAt,
				}),
		),
	);
};
