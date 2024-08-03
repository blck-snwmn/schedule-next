import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getEvents(year: number, month: number) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(
		`${endpoint}/api/events?year=${year}&month=${month}`,
		{ cache: "no-cache" }
	);
	if (!response.ok) {
		throw new Error("Failed to fetch events");
	}
	const json = (await response.json()) as ScheduleEvent[];
	console.log(json);
	return json;
}

export async function getEventById(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;

	const response = await fetch(`${endpoint}/api/events/${id}`, { cache: "no-cache" });
	if (!response.ok) {
		if (response.status === 404) {
			return null; // イベントが見つからない場合
		}
		throw new Error("Failed to fetch event");
	}
	const json = (await response.json()) as ScheduleEvent;
	return json;
}

export async function getTaletns() {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents`);
	if (!response.ok) {
		throw new Error("Failed to fetch talents");
	}
	const json = (await response.json()) as Talent[];
	return json;
}

export async function createTalent(name: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents`, {
		method: "POST",
		body: JSON.stringify({ name: name }),
	});
	if (!response.ok) {
		throw new Error("Failed to create talents");
	}
}

export async function updateTalent(id: string, name: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ name: name }),
	});
	if (!response.ok) {
		throw new Error("Failed to update talents");
	}
}

export async function deleteTalent(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		console.error("Failed to delete talent");
		throw new Error("Failed to delete talent");
	}
}
