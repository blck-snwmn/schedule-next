import { and, eq, gte, inArray, lte, not } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import {
	createEventSchema,
	createGroupSchema,
	groupSchema,
	groupsSchema,
	talentsSchema,
	updateEventSchema,
	updateGroupSchema,
} from "schema";
import {
	events,
	eventTalents,
	groupJoinTalents,
	groups,
	schedules,
	talents,
} from "./schema";
import type {
	EventWithDetails,
	GroupQueryResult,
	NewEvent,
	NewSchedule,
	NewTalent,
	QueryResult,
	Schedule,
	ScheduleEvent,
	Talent,
} from "./types";

const app = new Hono<{ Bindings: Env }>();

// app.use('/*', cors());

app.get("/api/events", async (c) => {
	const { year, month } = c.req.query();
	const now = new Date();
	const yearStr = year || now.getFullYear().toString();
	const monthStr = month || (now.getMonth() + 1).toString();

	const db = drizzle(c.env.DB);

	const startOfMonth = new Date(
		Number.parseInt(yearStr),
		Number.parseInt(monthStr) - 1,
		1,
	);
	const endOfMonth = new Date(
		Number.parseInt(yearStr),
		Number.parseInt(monthStr),
		0,
		23,
		59,
		59,
	);

	const eventIdsWithinRange = await db
		.select({ id: events.id })
		.from(events)
		.innerJoin(schedules, eq(events.id, schedules.eventId))
		.where(
			and(
				lte(schedules.startAt, endOfMonth),
				gte(schedules.endAt, startOfMonth),
			),
		)
		.groupBy(events.id);

	const eventIds = eventIdsWithinRange.map((e) => e.id);

	const result = (await db
		.select({
			id: events.id,
			name: events.name,
			description: events.description,
			category: events.category,
			thumbnail: events.thumbnail,
			schedules: schedules,
			talents: talents,
		})
		.from(events)
		.leftJoin(schedules, eq(events.id, schedules.eventId))
		.leftJoin(eventTalents, eq(events.id, eventTalents.eventId))
		.leftJoin(talents, eq(eventTalents.talentId, talents.id))
		.where(inArray(events.id, eventIds))
		.orderBy(schedules.startAt, schedules.endAt)) as QueryResult[];

	console.log(result.length);
	// 結果を整形
	const formattedEvents: EventWithDetails[] = result.reduce(
		(acc: EventWithDetails[], curr: QueryResult) => {
			const eventIndex = acc.findIndex((e) => e.id === curr.id);
			if (eventIndex === -1) {
				acc.push({
					...curr,
					schedules: [curr.schedules],
					talents: [curr.talents],
				});
			} else {
				if (
					!acc[eventIndex].schedules.find((s) => s.id === curr.schedules.id)
				) {
					acc[eventIndex].schedules.push(curr.schedules);
				}
				if (!acc[eventIndex].talents.find((t) => t.id === curr.talents.id)) {
					acc[eventIndex].talents.push(curr.talents);
				}
			}
			return acc;
		},
		[],
	);

	return c.json(formattedEvents);
});

app.get("/api/events/:id", async (c) => {
	const db = drizzle(c.env.DB);
	const { id } = c.req.param();

	const result = (await db
		.select({
			id: events.id,
			name: events.name,
			description: events.description,
			category: events.category,
			thumbnail: events.thumbnail,
			schedules: schedules,
			talents: talents,
		})
		.from(events)
		.where(eq(events.id, id))
		.leftJoin(schedules, eq(events.id, schedules.eventId))
		.leftJoin(eventTalents, eq(events.id, eventTalents.eventId))
		.leftJoin(talents, eq(eventTalents.talentId, talents.id))) as QueryResult[];

	if (!result.length) {
		return c.json({ error: "Event not found" }, 404);
	}

	// // イベント情報を整形
	const formattedEvent = {
		...result[0],
		schedules: result
			.map((e) => e.schedules)
			.reduce((acc: Schedule[], curr) => {
				if (!acc.find((s) => s.id === curr.id)) {
					acc.push(curr);
				}
				return acc;
			}, []),
		talents: result
			.map((e) => e.talents)
			.reduce((acc: Talent[], curr) => {
				if (!acc.find((t) => t.id === curr.id)) {
					acc.push(curr);
				}
				return acc;
			}, []),
	};
	console.log(formattedEvent);
	return c.json(formattedEvent);
});

// イベント登録エンドポイント
app.post("/api/events", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const eventData = createEventSchema.parse(await c.req.json());

	const newEvent: NewEvent = {
		id: crypto.randomUUID(),
		name: eventData.name,
		description: eventData.description,
		category: eventData.category,
		thumbnail: eventData.thumbnail,
	};

	await db.insert(events).values(newEvent);

	// スケジュールの追加
	for (const scheduleData of eventData.schedules) {
		const newSchedule: NewSchedule = {
			id: crypto.randomUUID(),
			eventId: newEvent.id,
			name: scheduleData.name,
			startAt: new Date(scheduleData.startAt),
			endAt: new Date(scheduleData.endAt),
		};
		await db.insert(schedules).values(newSchedule);
	}

	// タレントの関連付け
	for (const talentId of eventData.talentIds) {
		await db.insert(eventTalents).values({
			eventId: newEvent.id,
			talentId: talentId,
		});
	}

	return c.json({ id: newEvent.id }, 201);
});

app.patch("/api/events/:id", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const { id } = c.req.param();

	const eventData = updateEventSchema.parse(await c.req.json());
	console.log(eventData);

	// イベントの更新
	const updatedEvent = await db
		.update(events)
		.set({
			name: eventData.name,
			description: eventData.description,
			category: eventData.category,
			thumbnail: eventData.thumbnail,
		})
		.where(eq(events.id, id))
		.returning({ updatedId: events.id });

	// スケジュールの更新/追加/削除
	const updatedSchedules = eventData.schedules.filter((s) => s.id);
	const updatedScheduleIds = updatedSchedules
		.map((s) => s.id)
		.filter((s) => s != null);
	// スケジュールの削除
	const deletedScheduleIds = await db
		.delete(schedules)
		.where(
			and(
				eq(schedules.eventId, id),
				not(inArray(schedules.id, updatedScheduleIds)),
			),
		)
		.returning({ deletedId: schedules.id });

	// scheduleの id がないものは新規で登録。id があるものは更新
	for (const scheduleData of updatedSchedules) {
		if (!scheduleData.id) {
			continue;
		}

		await db
			.update(schedules)
			.set({
				name: scheduleData.name,
				startAt: new Date(scheduleData.startAt),
				endAt: new Date(scheduleData.endAt),
			})
			.where(eq(schedules.id, scheduleData.id));
	}

	const newScheduleData = eventData.schedules.filter((s) => !s.id);
	console.log("newScheduleData", newScheduleData);
	if (newScheduleData.length > 0) {
		await db.insert(schedules).values(
			newScheduleData.map((s) => ({
				id: crypto.randomUUID(),
				eventId: id,
				name: s.name,
				startAt: new Date(s.startAt),
				endAt: new Date(s.endAt),
			})),
		);
	}

	// タレントの関連付け。既存のタレントは削除してから追加
	await db.delete(eventTalents).where(eq(eventTalents.eventId, id));
	await db.insert(eventTalents).values([
		...eventData.talentIds.map((talentId) => ({
			eventId: id,
			talentId,
		})),
	]);

	return c.json({ ...eventData });
});

app.delete("/api/events/:id", async (c) => {
	const db = drizzle(c.env.DB);
	const { id } = c.req.param();

	const deletedScheduleIds = await db
		.delete(schedules)
		.where(eq(schedules.eventId, id))
		.returning({ deletedId: schedules.id });

	console.info(deletedScheduleIds);

	const deletedEventTalentIds = await db
		.delete(eventTalents)
		.where(eq(eventTalents.eventId, id))
		.returning({
			deletedId: eventTalents.eventId,
			deletedTalentId: eventTalents.talentId,
		});

	console.info(deletedEventTalentIds);

	const deletedEventIds = await db
		.delete(events)
		.where(eq(events.id, id))
		.returning({ deletedId: events.id });
	if (deletedEventIds.length === 0) {
		return c.json({ error: "Event not found" }, 404);
	}

	return c.json({ id });
});

app.get("/api/schedules", async (c) => {
	const { year, month } = c.req.query();
	const now = new Date();
	const yearStr = year || now.getFullYear().toString();
	const monthStr = month || (now.getMonth() + 1).toString();

	const db = drizzle(c.env.DB);

	const startOfMonth = new Date(
		Number.parseInt(yearStr),
		Number.parseInt(monthStr) - 1,
		1,
	);
	const endOfMonth = new Date(
		Number.parseInt(yearStr),
		Number.parseInt(monthStr),
		0,
		23,
		59,
		59,
	);

	const result = await db
		.select({
			id: schedules.id,
			name: schedules.name,
			startAt: schedules.startAt,
			endAt: schedules.endAt,
			event: {
				id: events.id,
				name: events.name,
				description: events.description,
				category: events.category,
				thumbnail: events.thumbnail,
			},
			talents: talents,
		})
		.from(schedules)
		.innerJoin(events, eq(schedules.eventId, events.id))
		.innerJoin(eventTalents, eq(events.id, eventTalents.eventId))
		.innerJoin(talents, eq(eventTalents.talentId, talents.id))
		.where(
			and(
				lte(schedules.startAt, endOfMonth),
				gte(schedules.endAt, startOfMonth),
			),
		)
		.orderBy(schedules.startAt, schedules.endAt);

	const formatedSchedule: ScheduleEvent[] = result.reduce(
		(acc: ScheduleEvent[], curr) => {
			const scheduleIndex = acc.findIndex((s) => s.id === curr.id);
			if (scheduleIndex === -1) {
				acc.push({
					...curr,
					event: {
						...curr.event,
						talents: [curr.talents],
					},
				});
			} else {
				if (
					!acc[scheduleIndex].event.talents.find(
						(t) => t.id === curr.talents.id,
					)
				) {
					acc[scheduleIndex].event.talents.push(curr.talents);
				}
			}
			return acc;
		},
		[],
	);

	return c.json(formatedSchedule);
});

app.get("/api/talents", async (c) => {
	const db = drizzle(c.env.DB);
	const result = await db.select().from(talents).orderBy(talents.sortKey);
	const talentData = talentsSchema.safeParse(result);
	if (!talentData.success) {
		return c.json({ error: "Failed to fetch talents" }, 500);
	}
	return c.json(talentData.data);
});

app.post("/api/talents", async (c) => {
	const db = drizzle(c.env.DB);
	const talentData = await c.req.json();

	const newTalent: NewTalent = {
		id: crypto.randomUUID(),
		name: talentData.name,
		sortKey: talentData.sortKey,
	};

	await db.insert(talents).values(newTalent);

	return c.json({ id: newTalent.id, name: newTalent.name }, 201);
});

app.patch("/api/talents/:talentID", async (c) => {
	const db = drizzle(c.env.DB);
	const { talentID } = c.req.param();
	const talentData = await c.req.json();

	const updatedIds = await db
		.update(talents)
		.set({
			name: talentData.name,
			sortKey: talentData.sortKey,
		})
		.where(eq(talents.id, talentID))
		.returning({ updatedId: talents.id });
	if (updatedIds.length === 0) {
		return c.json({ error: "Talent not found" }, 404);
	}

	return c.json({ talentID, ...talentData });
});

app.delete("/api/talents/:talentID", async (c) => {
	const db = drizzle(c.env.DB);
	const { talentID } = c.req.param();

	const deletedIds = await db
		.delete(talents)
		.where(eq(talents.id, talentID))
		.returning({ deletedId: talents.id });
	if (deletedIds.length === 0) {
		return c.json({ error: "Talent not found" }, 404);
	}

	return c.json({ talentID });
});

app.get("/api/groups", async (c) => {
	const db = drizzle(c.env.DB);
	const rawResult = await db
		.select({
			id: groups.id,
			name: groups.name,
			sortKey: groups.sortKey,
			description: groups.description,
			talents: talents,
		})
		.from(groups)
		.innerJoin(groupJoinTalents, eq(groups.id, groupJoinTalents.groupId))
		.innerJoin(talents, eq(talents.id, groupJoinTalents.talentId))
		.orderBy(groups.sortKey, talents.sortKey);

	const result = rawResult.reduce((acc: GroupQueryResult[], curr) => {
		const groupIndex = acc.findIndex((g) => g.id === curr.id);
		if (groupIndex === -1) {
			acc.push({
				...curr,
				talents: [curr.talents],
			});
		} else {
			if (!acc[groupIndex].talents.find((t) => t.id === curr.talents.id)) {
				acc[groupIndex].talents.push(curr.talents);
			}
		}
		return acc;
	}, [] as GroupQueryResult[]);

	const data = groupsSchema.safeParse(result);
	if (!data.success) {
		console.error(data.error);
		return c.json({ error: "Failed to fetch groups" }, 500);
	}
	return c.json(data.data);
});

app.get("/api/groups/:groupID", async (c) => {
	const db = drizzle(c.env.DB);
	const { groupID } = c.req.param();

	const rawResult = await db
		.select({
			id: groups.id,
			name: groups.name,
			sortKey: groups.sortKey,
			description: groups.description,
			talents: talents,
		})
		.from(groups)
		.innerJoin(groupJoinTalents, eq(groups.id, groupJoinTalents.groupId))
		.innerJoin(talents, eq(talents.id, groupJoinTalents.talentId))
		.where(eq(groups.id, groupID))
		.orderBy(talents.sortKey);

	if (rawResult.length === 0) {
		return c.json({ error: "Group not found" }, 404);
	}

	const result = {
		...rawResult[0],
		talents: rawResult.map((e) => e.talents).filter(Boolean),
	};

	const data = groupSchema.safeParse(result);
	if (!data.success) {
		console.error(data.error);
		return c.json({ error: "Failed to fetch groups" }, 500);
	}
	return c.json(data.data);
});

app.post("/api/groups", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const groupData = createGroupSchema.parse(await c.req.json());

	const newGroupId = crypto.randomUUID();
	await db.insert(groups).values({
		id: newGroupId,
		name: groupData.name,
		description: groupData.description,
		sortKey: groupData.sortKey,
	});

	for (const talentId of groupData.talentIds) {
		await db.insert(groupJoinTalents).values({
			groupId: newGroupId,
			talentId,
		});
	}

	return c.json({ id: newGroupId }, 201);
});

app.patch("/api/groups/:groupID", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const { groupID } = c.req.param();
	const groupData = updateGroupSchema.parse(await c.req.json());

	const updatedIds = await db
		.update(groups)
		.set({
			name: groupData.name,
			description: groupData.description,
			sortKey: groupData.sortKey,
		})
		.where(eq(groups.id, groupID))
		.returning({ updatedId: groups.id });
	if (updatedIds.length === 0) {
		return c.json({ error: "Group not found" }, 404);
	}

	await db
		.delete(groupJoinTalents)
		.where(eq(groupJoinTalents.groupId, groupID));
	for (const talentId of groupData.talentIds) {
		await db.insert(groupJoinTalents).values({
			groupId: groupID,
			talentId,
		});
	}

	return c.json({ groupID, ...groupData });
});

app.delete("/api/groups/:groupID", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const { groupID } = c.req.param();

	const ids = await db
		.delete(groupJoinTalents)
		.where(eq(groupJoinTalents.groupId, groupID))
		.returning({
			deletedGroupId: groupJoinTalents.groupId,
			deletedTalentId: groupJoinTalents.talentId,
		});

	console.info(ids);

	const deletedIds = await db
		.delete(groups)
		.where(eq(groups.id, groupID))
		.returning({ deletedId: groups.id });
	if (deletedIds.length === 0) {
		return c.json({ error: "Group not found" }, 404);
	}

	console.info(deletedIds);

	return c.json({ groupID });
});

export default app;
