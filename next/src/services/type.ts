type Status = "active" | "upcoming" | "past";

interface Schedule {
	id: string;
	name: string;
	startAt: Date; // ISO 8601 形式の日時文字列
	endAt: Date; // ISO 8601 形式の日時文字列
	status: Status;
}

interface ScheduleEvent {
	id: string;
	name: string;
	category: string;
	description?: string;
	thumbnail?: string; // サムネイル画像のURL
	schedules: Schedule[];
	talents: Talent[];
}

interface Talent {
	id: string;
	name: string;
}

interface AppData {
	talents: Talent[];
	events: ScheduleEvent[];
}
