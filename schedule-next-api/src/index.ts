import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { events, eventTalents, schedules, talents } from "./schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { EventWithDetails, QueryResult } from "./types";

const app = new Hono<{ Bindings: Env }>();

// app.use('/*', cors());

app.get('/api/events', async (c) => {
	const { year, month } = c.req.query();
	const db = drizzle(c.env.DB);

	const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
	const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

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

app.get('/api/talents', async (c) => {
	const db = drizzle(c.env.DB);
	const result = await db.select().from(talents);
	return c.json(result);
});

// 新しいイベントを作成するエンドポイントの例
app.post('/api/events', async (c) => {
	// const db = drizzle(c.env.DB);
	// const eventData = await c.req.json();

	// const newEvent = {
	// 	id: crypto.randomUUID(), // UUIDを生成
	// 	name: eventData.name,
	// 	description: eventData.description,
	// 	category: eventData.category,
	// 	thumbnail: eventData.thumbnail,
	// };

	// await db.insert(events).values(newEvent);

	// // スケジュールの追加
	// for (const scheduleData of eventData.schedules) {
	// 	await db.insert(schedules).values({
	// 		id: crypto.randomUUID(),
	// 		eventId: newEvent.id,
	// 		name: scheduleData.name,
	// 		startAt: new Date(scheduleData.startAt),
	// 		endAt: new Date(scheduleData.endAt),
	// 	});
	// }

	// // タレントの関連付け
	// for (const talentId of eventData.talentIds) {
	// 	await db.insert(eventTalents).values({
	// 		id: crypto.randomUUID(),
	// 		eventId: newEvent.id,
	// 		talentId: talentId,
	// 	});
	// }

	// return c.json({ id: newEvent.id }, 201);
});

export default app;