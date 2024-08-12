import { getRequestContext } from "@cloudflare/next-on-pages";
import { eventSchema, eventsSchema, talentsSchema } from "schema";
import type { CreateScheduleEvent, EditScheduleEvent } from "./type";

export async function getEvents(year: number, month: number) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(
		`${endpoint}/api/events?year=${year}&month=${month}`,
		{
			next: {
				tags: ["events"],
			},
		},
	);
	if (!response.ok) {
		throw new Error("Failed to fetch events");
	}
	const result = eventsSchema.safeParse(await response.json());
	if (!result.success) {
		console.error(result.error.errors);
		throw new Error("Failed to fetch events");
	}
	return result.data;
}

export async function getEventById(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;

	const response = await fetch(`${endpoint}/api/events/${id}`, {
		next: {
			tags: [`events?eventId=${id}`],
		},
	});
	if (!response.ok) {
		if (response.status === 404) {
			return null; // イベントが見つからない場合
		}
		throw new Error("Failed to fetch event");
	}
	const result = eventSchema.safeParse(await response.json());
	if (!result.success) {
		throw new Error("Failed to fetch event");
	}
	return result.data;
}

export async function createEvent(event: CreateScheduleEvent) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/events`, {
		method: "POST",
		body: JSON.stringify(event),
	});
	if (!response.ok) {
		throw new Error("Failed to create event");
	}
}

export async function updateEvent(event: EditScheduleEvent) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/events/${event.id}`, {
		method: "PATCH",
		body: JSON.stringify(event),
	});
	if (!response.ok) {
		const error = await response.text();
		console.error("Failed to update event", error);
		throw new Error("Failed to update event");
	}
}

export async function deleteEvent(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/events/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		console.error("Failed to delete event");
		throw new Error("Failed to delete event");
	}
}

export async function getTaletns() {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents`, {
		next: { tags: ["talents"] },
	});
	if (!response.ok) {
		throw new Error("Failed to fetch talents");
	}
	const result = talentsSchema.safeParse(await response.json());
	if (!result.success) {
		throw new Error("Failed to fetch talents");
	}
	return result.data;
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
