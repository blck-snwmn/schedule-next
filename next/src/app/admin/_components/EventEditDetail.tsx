"use client";

import { eventFormSchema } from "@/services/schema";
import { type ScheduleEvent, type Talent, categories } from "@/services/type";
import {
	type SubmissionResult,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

export function EventEditDetail({ event, talents, serverAction }: Props) {
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
	return (
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			className="space-y-8"
		>
			<Card>
				<CardHeader>
					<h2 className="text-2xl font-bold">Event Details</h2>
				</CardHeader>
				<CardContent className="space-y-4">
					<Input {...getInputProps(fields.id, { type: "hidden" })} />

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={fields.name.id}>Event Name</Label>
							<Input
								{...getInputProps(fields.name, { type: "text" })}
								required
								className="w-full"
							/>
							<ErrorMessage error={fields.name.errors} />
						</div>
						<div className="space-y-2">
							<Label htmlFor={fields.category.id}>Category</Label>
							<Select
								// {...getSelectProps(fields.category)}
								key={fields.category.id}
								name={fields.category.name}
								defaultValue={fields.category.value}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="カテゴリ" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<ErrorMessage error={fields.category.errors} />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor={fields.description.id}>Description</Label>
						<Textarea
							{...getTextareaProps(fields.description)}
							className="w-full h-32"
						/>
						<ErrorMessage error={fields.description.errors} />
					</div>

					<div className="space-y-2">
						<Label htmlFor={fields.thumbnail.id}>Thumbnail URL</Label>
						<Input
							{...getInputProps(fields.thumbnail, { type: "url" })}
							className="w-full"
						/>
						<ErrorMessage error={fields.thumbnail.errors} />
					</div>

					<div className="space-y-2">
						<Label>Talents</Label>
						<div className="grid grid-cols-3 gap-4">
							{talents.map((talent) => (
								<div
									key={`div-${talent.name}`}
									className="flex items-center space-x-2"
								>
									<Checkbox
										id={`talent-${talent.id}`}
										name={fields.talentIds.name}
										value={talent.id}
										defaultChecked={fields.talentIds.initialValue?.includes(
											talent.id,
										)}
									/>
									<Label htmlFor={`talent-${talent.id}`}>{talent.name}</Label>
								</div>
							))}
						</div>
						<ErrorMessage error={fields.talentIds.errors} />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<h2 className="text-2xl font-bold">Schedules</h2>
				</CardHeader>
				<CardContent className="space-y-4">
					{schedules.map((schedule, index) => {
						const sfields = schedule.getFieldset();
						return (
							<Card key={schedule.key} className="bg-gray-50">
								<CardContent className="space-y-4 pt-4">
									<Input {...getInputProps(sfields.id, { type: "hidden" })} />
									<div className="flex items-center space-x-4">
										<div className="flex-grow">
											<Label htmlFor={sfields.name.id}>Schedule Name</Label>
											<Input
												{...getInputProps(sfields.name, { type: "text" })}
												className="w-full"
											/>
											<ErrorMessage error={sfields.name.errors} />
										</div>
										<Button
											type="button"
											variant="destructive"
											onClick={() =>
												form.remove({ name: fields.schedules.name, index })
											}
											className="mt-6"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor={sfields.startAt.id}>Start Time</Label>
											<div className="relative">
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
													className="w-full pl-10"
												/>
												{/* <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
											</div>
											<ErrorMessage error={sfields.startAt.errors} />
										</div>
										<div>
											<Label htmlFor={sfields.endAt.id}>End Time</Label>
											<div className="relative">
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
													className="w-full pl-10"
												/>
												{/* <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
											</div>
											<ErrorMessage error={sfields.endAt.errors} />
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</CardContent>
				<CardFooter>
					<Button
						type="button"
						onClick={() =>
							form.insert({
								name: fields.schedules.name,
								defaultValue: {
									name: "New Schedule",
									startAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
									endAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
								},
							})
						}
						className="w-full"
					>
						<Plus className="h-4 w-4 mr-2" /> Add Schedule
					</Button>
				</CardFooter>
			</Card>

			<Button type="submit" className="w-full">
				Save Event
			</Button>
		</form>
	);
}
