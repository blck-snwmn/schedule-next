import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { events, eventTalents, schedules, talents } from "./schema";
import type {
	EventWithDetails,
	NewEvent,
	NewSchedule,
	NewTalent,
	QueryResult,
	Schedule,
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
		talents: result.map((e) => e.talents).filter(Boolean),
	};

	return c.json(formattedEvent);
});

// イベント登録エンドポイント
app.post("/api/events", async (c) => {
	// D1 does not support `transaction`.
	const db = drizzle(c.env.DB);
	const eventData = await c.req.json();

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

app.patch("/api/events/:id", async (c) => { });

app.delete("/api/events/:id", async (c) => {
	const db = drizzle(c.env.DB);
	const { id } = c.req.param();

	const deletedScheduleIds = await db.delete(schedules)
		.where(eq(schedules.eventId, id))
		.returning({ deletedId: schedules.id });

	console.info(deletedScheduleIds);

	const deletedEventTalentIds = await db.delete(eventTalents)
		.where(eq(eventTalents.eventId, id))
		.returning(
			{
				deletedId: eventTalents.eventId,
				deletedTalentId: eventTalents.talentId
			}
		);

	console.info(deletedEventTalentIds);

	const deletedEventIds = await db.delete(events)
		.where(eq(events.id, id))
		.returning({ deletedId: events.id });
	if (deletedEventIds.length === 0) {
		return c.json({ error: "Event not found" }, 404);
	}

	return c.json({ id });
});

app.get("/api/talents", async (c) => {
	const db = drizzle(c.env.DB);
	const result = await db.select().from(talents);
	return c.json(result);
});

app.post("/api/talents", async (c) => {
	const db = drizzle(c.env.DB);
	const talentData = await c.req.json();

	const newTalent: NewTalent = {
		id: crypto.randomUUID(),
		name: talentData.name,
	};

	await db.insert(talents).values(newTalent);

	return c.json({ id: newTalent.id, name: newTalent.name }, 201);
});


app.patch("/api/talents/:talentID", async (c) => {
	const db = drizzle(c.env.DB);
	const { talentID } = c.req.param();
	const talentData = await c.req.json();

	const updatedIds = await db.update(talents)
		.set({
			name: talentData.name,
		})
		.where(eq(talents.id, talentID))
		.returning({ updatedId: talents.id });
	if (updatedIds.length === 0) {
		return c.json({ error: "Talent not found" }, 404);
	}

	return c.json({ talentID, ...talentData });
})

app.delete("/api/talents/:talentID", async (c) => {
	const db = drizzle(c.env.DB);
	const { talentID } = c.req.param();

	const deletedIds = await db.delete(talents)
		.where(eq(talents.id, talentID))
		.returning({ deletedId: talents.id });
	if (deletedIds.length === 0) {
		return c.json({ error: "Talent not found" }, 404);
	}

	return c.json({ talentID });
});

export default app;
