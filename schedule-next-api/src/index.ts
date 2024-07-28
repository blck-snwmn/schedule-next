import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { events, eventTalents, schedules, talents } from "./schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { EventWithDetails, NewEvent, NewSchedule, NewTalent, QueryResult } from "./types";

const app = new Hono<{ Bindings: Env }>();

// app.use('/*', cors());

app.get('/api/events', async (c) => {
	const { year, month } = c.req.query();
	const now = new Date();
	const yearStr = year || now.getFullYear().toString();
	const monthStr = month || (now.getMonth() + 1).toString();

	const db = drizzle(c.env.DB);

	const startOfMonth = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
	const endOfMonth = new Date(parseInt(yearStr), parseInt(monthStr), 0, 23, 59, 59);

	const result = await db.select({
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
		.where(
			and(
				lte(schedules.startAt, endOfMonth),
				gte(schedules.endAt, startOfMonth)
			)
		) as QueryResult[];

	console.log(result.length);
	// 結果を整形
	const formattedEvents: EventWithDetails[] = result.reduce((acc: EventWithDetails[], curr: QueryResult) => {
		const eventIndex = acc.findIndex(e => e.id === curr.id);
		if (eventIndex === -1) {
			acc.push({
				...curr,
				schedules: [curr.schedules],
				talents: [curr.talents],
			});
		} else {
			if (!acc[eventIndex].schedules.find(s => s.id === curr.schedules.id)) {
				acc[eventIndex].schedules.push(curr.schedules);
			}
			if (!acc[eventIndex].talents.find(t => t.id === curr.talents.id)) {
				acc[eventIndex].talents.push(curr.talents);
			}
		}
		return acc;
	}, []);

	return c.json(formattedEvents);
});

app.get('/api/events/:id', async (c) => {
	const db = drizzle(c.env.DB);
	const { id } = c.req.param();

	const event = await db.select()
		.from(events)
		.where(eq(events.id, id))
		.leftJoin(schedules, eq(events.id, schedules.eventId))
		.leftJoin(eventTalents, eq(events.id, eventTalents.eventId))
		.leftJoin(talents, eq(eventTalents.talentId, talents.id));

	if (!event.length) {
		return c.json({ error: 'Event not found' }, 404);
	}

	// イベント情報を整形
	const formattedEvent = {
		...event[0].events,
		schedules: event.map(e => e.schedules).filter(Boolean),
		talents: event.map(e => e.talents).filter(Boolean),
	};

	return c.json(formattedEvent);
});

app.get('/api/talents', async (c) => {
	const db = drizzle(c.env.DB);
	const result = await db.select().from(talents);
	return c.json(result);
});

app.post('/api/talents', async (c) => {
	const db = drizzle(c.env.DB);
	const talentData = await c.req.json();

	const newTalent: NewTalent = {
		id: crypto.randomUUID(),
		name: talentData.name,
	};

	await db.insert(talents).values(newTalent);

	return c.json({ id: newTalent.id, name: newTalent.name }, 201);
});

// イベント登録エンドポイント
app.post('/api/events', async (c) => {
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

export default app;