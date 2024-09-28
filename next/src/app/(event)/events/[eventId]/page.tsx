import { EventDetail } from "@/app/(event)/events/_components/EventDetail";
import { getEventById } from "@/services/getData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
	params: { eventId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const event = await getEventById(params.eventId);

	if (!event) {
		return {
			title: "イベントが見つかりません",
		};
	}

	return {
		title: event.name,
		description: event.description || `${event.name}のイベント詳細情報`,
		openGraph: {
			title: event.name,
			description: event.description || `${event.name}のイベント詳細情報`,
			images: event.thumbnail ? [{ url: event.thumbnail }] : [],
		},
		twitter: {
			title: event.name,
			description: event.description || `${event.name}のイベント詳細情報`,
			images: event.thumbnail ? [{ url: event.thumbnail }] : [],
		},
	};
}

export default async function Detail({ params }: Props) {
	const event = await getEventById(params.eventId);
	if (!event) {
		notFound();
	}
	return <EventDetail event={event} />;
}
