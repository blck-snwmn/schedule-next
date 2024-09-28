import type { ScheduleWithEvent, Talent } from "@/services/type";

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
    return (
        <div>schedules</div>
    )
}