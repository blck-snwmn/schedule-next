import "server-only";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
	eventSchema,
	eventsSchema,
	groupSchema,
	groupsSchema,
	scheduleEventsSchema,
	talentsSchema,
} from "schema";
import type {
	CreateGroup,
	CreateScheduleEvent,
	EditGroup,
	EditScheduleEvent,
} from "./type";

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
		const error = await response.text();
		console.error(`Failed to fetch events: ${error}`);
		throw new Error("Failed to fetch events");
	}
	const result = eventsSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse events: %o", result.error);
		throw new Error("Failed to parse events");
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
		const error = await response.text();
		console.error(`Failed to fetch event: ${error}`);
		throw new Error("Failed to fetch event");
	}
	const result = eventSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse event: %o", result.error);
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
		const error = await response.text();
		console.error("Failed to create event", error);
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
		console.error(`Failed to update event: ${error}`);
		throw new Error("Failed to update event");
	}
}

export async function deleteEvent(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/events/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to delete event: ${error}`);
		throw new Error("Failed to delete event");
	}
}

export async function getSchedules(year: number, month: number) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(
		`${endpoint}/api/schedules?year=${year}&month=${month}`,
		{
			next: { tags: ["schedules"] },
		},
	);
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to fetch schedules: ${error}`);
		throw new Error("Failed to fetch schedules");
	}
	const result = scheduleEventsSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse schedules: %o", result.error);
		throw new Error("Failed to fetch schedules");
	}
	return result.data;
}

export async function getTaletns() {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents`, {
		next: { tags: ["talents"] },
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to fetch talents: ${error}`);
		throw new Error("Failed to fetch talents");
	}
	const result = talentsSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse talents: %o", result.error);
		throw new Error("Failed to fetch talents");
	}
	return result.data;
}

export async function createTalent(name: string, sortKey: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents`, {
		method: "POST",
		body: JSON.stringify({ name: name, sortKey: sortKey }),
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to create talents: ${error}`);
		throw new Error("Failed to create talents");
	}
}

export async function updateTalent(id: string, name: string, sortKey: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ name: name, sortKey: sortKey }),
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to update talents: ${error}`);
		throw new Error("Failed to update talents");
	}
}

export async function deleteTalent(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/talents/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to delete talent: ${error}`);
		throw new Error("Failed to delete talent");
	}
}

export async function getGroups() {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/groups`, {
		next: { tags: ["groups"] },
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to fetch groups: ${error}`);
		throw new Error("Failed to fetch groups");
	}
	const result = groupsSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse groups: %o", result.error);
		throw new Error("Failed to parse groups");
	}
	return result.data;
}

export async function getGroupById(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;

	const response = await fetch(`${endpoint}/api/groups/${id}`, {
		next: {
			tags: [`groups?groupId=${id}`],
		},
	});
	if (!response.ok) {
		if (response.status === 404) {
			return null; // グループが見つからない場合
		}
		const error = await response.text();
		console.error(`Failed to fetch group: ${error}`);
		throw new Error("Failed to fetch group");
	}
	const result = groupSchema.safeParse(await response.json());
	if (!result.success) {
		console.error("Failed to parse group: %o", result.error);
		throw new Error("Failed to fetch group");
	}
	return result.data;
}

export async function createGroup(group: CreateGroup) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/groups`, {
		method: "POST",
		body: JSON.stringify(group),
	});
	if (!response.ok) {
		const error = await response.text();
		console.error("Failed to create group", error);
		throw new Error("Failed to create group");
	}
}

export async function updateGroup(group: EditGroup) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/groups/${group.id}`, {
		method: "PATCH",
		body: JSON.stringify(group),
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to update group: ${error}`);
		throw new Error("Failed to update group");
	}
}

export async function deleteGroup(id: string) {
	const endpoint = getRequestContext().env.ENDPOINT;
	const response = await fetch(`${endpoint}/api/groups/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to delete group: ${error}`);
		throw new Error("Failed to delete group");
	}
}
