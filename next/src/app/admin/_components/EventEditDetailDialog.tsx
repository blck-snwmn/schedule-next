"use client";

// import { EventEditDetail } from "./EventEditDetail";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventFormSchema } from "@/services/schema";
import type { ScheduleEvent, Talent } from "@/services/type";
import {
	type SubmissionResult,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

const ErrorMessage = ({ error }: { error?: string[] }) => {
	return <div className="text-red-500">{error}</div>;
};

type Props = {
	event: ScheduleEvent | null;
	talents: Talent[];
	serverAction: (
		prevState: unknown,
		formData: FormData,
	) => Promise<SubmissionResult<string[]>>;
};

export function EditDetailDialog<T>({ event, talents, serverAction }: Props) {
	const router = useRouter(); // required "use client"
	const [lastResult, action] = useFormState(serverAction, undefined);
	console.log("lastResult", lastResult);

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: eventFormSchema });
		},
		constraint: getZodConstraint(eventFormSchema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		defaultValue: event
			? {
					id: event.id,
					name: event.name,
					category: event.category,
					description: event.description,
					thumbnail: event.thumbnail,
					talentIds: event.talents.map((talent) => talent.id),
					schedules: event.schedules.map((schedule) => ({
						id: schedule.id,
						name: schedule.name,
						startAt: format(
							new Date(schedule.startAt ?? ""),
							"yyyy-MM-dd'T'HH:mm",
						),
						endAt: format(new Date(schedule.endAt ?? ""), "yyyy-MM-dd'T'HH:mm"),
					})),
				}
			: {
					id: "",
					name: "",
					category: "",
					description: "",
					thumbnail: "",
					talentIds: [],
					schedules: [],
				},
	});

	const schedules = fields.schedules.getFieldList();
	console.log("fields", fields.talentIds.getFieldList());
	return (
		<Dialog open={true} onOpenChange={() => router.back()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>X:{event?.name ?? "New"}</DialogTitle>
				</DialogHeader>
				<form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
					<div className="grid grid-cols-2 gap-4">
						<Input {...getInputProps(fields.id, { type: "hidden" })} />
						<div>
							<Label htmlFor={fields.name.id}>Event Name</Label>
							<ErrorMessage error={fields.name.errors} />
							<Input
								{...getInputProps(fields.name, { type: "text" })}
								required
							/>
						</div>
						<div>
							<Label htmlFor={fields.category.id}>Category</Label>
							<ErrorMessage error={fields.category.errors} />
							<Input
								{...getInputProps(fields.category, { type: "text" })}
								required
							/>
						</div>
						<div className="col-span-2">
							<Label htmlFor={fields.description.id}>Description</Label>
							<ErrorMessage error={fields.description.errors} />
							<Textarea {...getTextareaProps(fields.description)} />
						</div>
						<div className="col-span-2">
							<Label htmlFor={fields.thumbnail.id}>Thumbnail URL</Label>
							<ErrorMessage error={fields.thumbnail.errors} />
							<Input {...getInputProps(fields.thumbnail, { type: "url" })} />
						</div>
						<div className="col-span-2">
							<Label>Talents</Label>
							<ErrorMessage error={fields.talentIds.errors} />
							<div className="grid grid-cols-3 gap-4">
								{talents.map((talent) => (
									<div key={`div-${talent.name}`}>
										<Checkbox
											id={`talent-${talent.id}`}
											name={fields.talentIds.name}
											value={talent.id}
											defaultChecked={
												fields.talentIds.initialValue &&
												Array.isArray(fields.talentIds.initialValue)
													? fields.talentIds.initialValue.includes(talent.id)
													: fields.talentIds.initialValue === talent.id
											}
										/>
										<Label
											key={`label-talent-${talent.id}`}
											htmlFor={`talent-${talent.id}`}
										>
											{talent.name}
										</Label>
									</div>
								))}
								<ErrorMessage error={fields.talentIds.errors} />
							</div>
						</div>
						<div className="col-span-2">
							<Label>Schedules</Label>
							<ErrorMessage error={fields.schedules.errors} />
							{schedules.map((schedule, index) => {
								const sfields = schedule.getFieldset();
								return (
									<div key={schedule.key}>
										<ErrorMessage error={sfields.id.errors} />
										<Input {...getInputProps(sfields.id, { type: "text" })} />

										<ErrorMessage error={sfields.name.errors} />
										<Input {...getInputProps(sfields.name, { type: "text" })} />

										<ErrorMessage error={sfields.startAt.errors} />
										<Input
											{...getInputProps(sfields.startAt, {
												type: "datetime-local",
											})}
											defaultValue={
												sfields.startAt.value
													? format(
															new Date(sfields.startAt.value),
															"yyyy-MM-dd'T'HH:mm",
														)
													: ""
											}
										/>

										<ErrorMessage error={sfields.endAt.errors} />
										<Input
											{...getInputProps(sfields.endAt, {
												type: "datetime-local",
											})}
											defaultValue={
												sfields.endAt.value
													? format(
															new Date(sfields.endAt.value),
															"yyyy-MM-dd'T'HH:mm",
														)
													: ""
											}
										/>
										<Button
											type="button"
											variant="destructive"
											onClick={() =>
												form.remove({ name: fields.schedules.name, index })
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								);
							})}
							<Button
								className="mt-2"
								type="button"
								onClick={() =>
									form.insert({
										name: fields.schedules.name,
										defaultValue: {
											id: crypto.randomUUID(),
											name: "SAMPLE",
										},
									})
								}
							>
								Add Schedule
							</Button>
						</div>
					</div>
					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Save Event</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
