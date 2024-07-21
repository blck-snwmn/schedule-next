import { Badge } from "@/components/ui/badge";
export const EventDetail: React.FC<{ event: ScheduleEvent }> = ({ event }) => {
	return (
		<div className="text-foreground">
			<div className="mb-4">
				<Badge>{event.category}</Badge>
			</div>
			{event.thumbnail && (
				<img
					src={event.thumbnail}
					alt={event.name}
					className="w-full h-48 object-cover rounded mb-4"
				/>
			)}
			{event.description && (
				<p className="text-muted-foreground mb-6">{event.description}</p>
			)}
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-2">スケジュール</h3>
				{event.schedules.map((schedule) => (
					<div key={schedule.id} className="mb-2 p-2 bg-muted rounded">
						<p className="font-semibold">{schedule.name}</p>
						<p className="text-sm text-muted-foreground">
							{new Date(schedule.start_at).toLocaleString()} -{" "}
							{new Date(schedule.end_at).toLocaleString()}
						</p>
					</div>
				))}
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">関連タレント</h3>
				<div className="flex flex-wrap gap-2">
					{event.relatedTalents.map((talent) => (
						<Badge key={talent.id} variant="secondary">
							{talent.name}
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
};
