import { describe, expect, it } from "vitest";
import { hasEvent } from "./eventUtils";
import type { ScheduleEvent } from "@/services/type";

describe("hasEvent", () => {
	it("should return true for an event entirely within the day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Same Day Schedule",
						startAt: new Date("2024-07-01T10:00:00Z"),
						endAt: new Date("2024-07-01T15:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return true for an event starting at the beginning of the day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Full Day Schedule",
						startAt: new Date("2024-07-01T00:00:00Z"),
						endAt: new Date("2024-07-01T15:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return false for an event on a different day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Different Day Schedule",
						startAt: new Date("2024-07-01T00:00:00Z"),
						endAt: new Date("2024-07-01T15:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-02"), events)).toBe(false);
	});

	it("should return true for an event ending exactly at midnight", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Midnight Ending Schedule",
						startAt: new Date("2024-07-01T00:00:00Z"),
						endAt: new Date("2024-07-02T00:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-02"), events)).toBe(true);
	});

	it("should return true for an event spanning multiple days", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Multi-day Schedule",
						startAt: new Date("2024-07-01T00:00:00Z"),
						endAt: new Date("2024-07-03T23:59:59Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-02"), events)).toBe(true);
	});

	it("should return true for an event starting late in the day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Late Starting Schedule",
						startAt: new Date("2024-07-01T22:00:00Z"),
						endAt: new Date("2024-07-02T02:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return true for an event ending early in the day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Early Ending Schedule",
						startAt: new Date("2024-06-30T22:00:00Z"),
						endAt: new Date("2024-07-01T02:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return false for an event on a completely different day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Other Day Schedule",
						startAt: new Date("2024-07-02T10:00:00Z"),
						endAt: new Date("2024-07-02T15:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(false);
	});

	it("should return false when there are no events", () => {
		expect(hasEvent(new Date("2024-07-01"), [])).toBe(false);
	});

	// 追加のテストケース

	it("should return true for an event starting exactly at midnight", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Midnight Starting Schedule",
						startAt: new Date("2024-07-01T00:00:00Z"),
						endAt: new Date("2024-07-01T04:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return true for an event ending just before midnight", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Almost Midnight Ending Schedule",
						startAt: new Date("2024-07-01T20:00:00Z"),
						endAt: new Date("2024-07-01T23:59:59.999Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});

	it("should return true for an event with multiple schedules, one of which is on the day", () => {
		const events: ScheduleEvent[] = [
			{
				id: "1",
				name: "Test Event",
				category: "Test",
				schedules: [
					{
						id: "1",
						name: "Off Day Schedule",
						startAt: new Date("2024-07-02T10:00:00Z"),
						endAt: new Date("2024-07-02T15:00:00Z"),
					},
					{
						id: "2",
						name: "On Day Schedule",
						startAt: new Date("2024-07-01T14:00:00Z"),
						endAt: new Date("2024-07-01T16:00:00Z"),
					},
				],
				talents: [{ id: "1", name: "Test Talent" }],
			},
		];
		expect(hasEvent(new Date("2024-07-01"), events)).toBe(true);
	});
});
