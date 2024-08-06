"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
// import { EventEditDetail } from "./EventEditDetail";
import { Button } from "./ui/button";
import { useFormState } from "react-dom";
import { getFormProps, getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { eventFormSchema } from "@/services/schema";
import { updateEventAction } from "@/actions/event";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

type Props<T> = {
	event: ScheduleEvent;
	talents: Talent[];
	action: (form: FormData) => Promise<T>;
};

export default function EditDetailDialog<T>({
	event,
	talents,
	// action,
}: Props<T>) {
	const router = useRouter(); // required "use client"
	const [lastResult, ac] = useFormState(updateEventAction, undefined);
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: eventFormSchema });
		},
		// shouldValidate: "onBlur",
		defaultValue: {
			name: event.name,
			category: event.category,
			description: event.description,
			thumbnail: event.thumbnail,
			talentIds: event.talents.map((talent) => talent.id),
			schedules: event.schedules.map((schedule) => ({
				id: schedule.id,
				name: schedule.name,
				startAt: format(new Date(schedule.startAt ?? ""), "yyyy-MM-dd'T'HH:mm"),
				endAt: format(new Date(schedule.endAt ?? ""), "yyyy-MM-dd'T'HH:mm"),
			})),
		},
	});

	const schedules = fields.schedules.getFieldList();

	return (
		<Dialog open={true} onOpenChange={() => router.back()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>X:{event.name}</DialogTitle>
				</DialogHeader>
				<form {...getFormProps(form)}>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor={fields.name.id}>Event Name</Label>
							<Input {...getInputProps(fields.name, { type: "text" })} required />
						</div>
						<div>
							<Label htmlFor={fields.category.id}>Category</Label>
							<Input
								{...getInputProps(fields.category, { type: "text" })}
								required
							/>
						</div>
						<div className="col-span-2">
							<Label htmlFor={fields.description.id}>Description</Label>
							<Textarea
								{...getTextareaProps(fields.description)}
							/>
						</div>
						<div className="col-span-2">
							<Label htmlFor={fields.thumbnail.id}>Thumbnail URL</Label>
							<Input
								{...getInputProps(fields.thumbnail, { type: "url" })}
							/>
						</div>
						<div className="col-span-2">
							<Label>Talents</Label>
							<Label>Talents</Label>
							<div className="flex flex-wrap gap-2 mt-2">
								{talents.map((talent) => (
									<Toggle
										key={talent.id}
									// pressed={fields.talentIds.value?.includes(talent.id)}
									// onPressedChange={(pressed) => {
									// 	const newTalentIds = pressed
									// 		? [...(fields.talentIds.value || []), talent.id]
									// 		: (fields.talentIds.value || []).filter(id => id !== talent.id);
									// 	fields.talentIds.value.onChange(newTalentIds);
									// }}
									>
										{talent.name}
									</Toggle>
								))}
							</div>
						</div>
						<div className="col-span-2">
							<Label>Schedules</Label>
							{schedules.map((schedule, index) => {
								const sfields = schedule.getFieldset();
								// form.remove({
								// 	name: form.
								// })
								return (
									<div
										key={schedule.key}
									// className="grid grid-cols-5 gap-2 items-end mt-2"
									>
										<Input
											{...getInputProps(sfields.name, { type: "text" })}
										/>
										<Input
											{...getInputProps(sfields.startAt, { type: "datetime-local", })}
											defaultValue={sfields.startAt.value ? format(new Date(sfields.startAt.value), "yyyy-MM-dd'T'HH:mm") : ""}

										/>
										<Input
											{...getInputProps(sfields.endAt, { type: "datetime-local" })}
											defaultValue={sfields.endAt.value ? format(new Date(sfields.endAt.value), "yyyy-MM-dd'T'HH:mm") : ""}
										/>
										<Button
											type="button"
											variant="destructive"
											// size="icon"
											// {...form.remove.getButtonProps({
											// 	name: fields.schedules.name,
											// 	index: index,
											// })}
											// type="submit"
											onClick={() => form.remove({ name: fields.schedules.name, index })}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)
							})}
							<Button
								className="mt-2"
								type="button"
								onClick={() => form.insert(
									{
										name: fields.schedules.name,
										defaultValue: {
											id: crypto.randomUUID(),
											name: "SAMPLE",
											// startAt: new Date().toISOString(),
											// endAt: new Date().toISOString(),
										}
									}
								)}
							// {...form.insert.getButtonProps({
							// 	name: fields.schedules.name,
							// 	// defaultValue: {
							// 	// 	// id: crypto.randomUUID(),
							// 	// 	name: "SAMPLE",
							// 	// 	startAt: new Date().toISOString(),
							// 	// 	endAt: new Date().toISOString(),
							// 	// },
							// })}
							>
								Add Schedule
							</Button>
						</div>
					</div>
					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<DialogClose asChild>
						</DialogClose>
						<Button type="submit">Save Event</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
