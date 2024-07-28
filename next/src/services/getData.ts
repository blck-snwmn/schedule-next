import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getEvents(year: number, month: number) {
	const endpoint = getRequestContext().env.ENDPOINT
	const response = await fetch(`${endpoint}/api/events?year=${year}&month=${month}`);
	if (!response.ok) {
		throw new Error('Failed to fetch events');
	}
	const json = await response.json() as ScheduleEvent[]
	return json
}

export async function getEventById(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;

	const response = await fetch(`${endpoint}/api/events/${id}`);
	if (!response.ok) {
		if (response.status === 404) {
			return null; // イベントが見つからない場合
		}
		throw new Error('Failed to fetch event');
	}
	const json = await response.json();
	return json;
}

export async function getTaletns() {
	const endpoint = getRequestContext().env.ENDPOINT
	const response = await fetch(`${endpoint}/api/talents`);
	if (!response.ok) {
		throw new Error("Failed to fetch talents");
	}
	const json = await response.json() as Talent[]
	return json;
}
