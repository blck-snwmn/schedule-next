
type Status = 'active' | 'upcoming' | 'past';

interface Schedule {
    id: number;
    name: string;
    start_at: string; // ISO 8601 形式の日時文字列
    end_at: string;   // ISO 8601 形式の日時文字列
    status: Status;
}

interface ScheduleEvent {
    id: number;
    name: string;
    category: string;
    description?: string;
    thumbnail?: string; // サムネイル画像のURL
    schedules: Schedule[];
    relatedTalents: Talent[];
}

interface Talent {
    id: number;
    name: string;
}

interface AppData {
    talents: Talent[];
    events: ScheduleEvent[];
}
