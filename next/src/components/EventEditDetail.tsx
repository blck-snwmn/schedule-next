import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";

interface EventFormProps {
	event: ScheduleEvent;
	talents: Talent[];
}

export const EventEditDetail = ({ event, talents }: EventFormProps) => {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div>
				<Label htmlFor="name">Event Name</Label>
				<Input id="name" name="name" defaultValue={event.name} required />
			</div>
			<div>
				<Label htmlFor="category">Category</Label>
				<Input
					id="category"
					name="category"
					defaultValue={event.category}
					required
				/>
			</div>
			<div className="col-span-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					defaultValue={event.description}
				/>
			</div>
			<div className="col-span-2">
				<Label htmlFor="thumbnail">Thumbnail URL</Label>
				<Input
					id="thumbnail"
					name="thumbnail"
					type="url"
					defaultValue={event.thumbnail}
				/>
			</div>
			<div className="col-span-2">
				<Label>Talents</Label>
				<div className="flex">
					<div className="flex flex-wrap gap-2">
						{talents.map((talent) => (
							<Toggle
								key={talent.id}
								pressed={event.talents.some((t) => t.id === talent.id)}
								// onPressedChange={() => toggleTalent(talent.id)}
							>
								{talent.name}
							</Toggle>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
