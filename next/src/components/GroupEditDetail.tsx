"use client";

import { groupFormSchema } from "@/services/schema";
import type { Group, Talent } from "@/services/type";
import {
	type SubmissionResult,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const ErrorMessage = ({ error }: { error?: string[] }) => {
	return <div className="text-red-500">{error}</div>;
};

type Props = {
	group: Group | null;
	talents: Talent[];
	serverAction: (
		prevState: unknown,
		formData: FormData,
	) => Promise<SubmissionResult<string[]>>;
};

export function GroupEditDetail({ group, talents, serverAction }: Props) {
	const [lastResult, action] = useFormState(serverAction, undefined);
	console.log("lastResult", lastResult);

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: groupFormSchema });
		},
		constraint: getZodConstraint(groupFormSchema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		defaultValue: group
			? {
					id: group.id,
					name: group.name,
					description: group.description,
					talentIds: group.talents.map((talent) => talent.id),
				}
			: {
					id: "",
					name: "",
					description: "",
					talentIds: [],
				},
	});

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
			<Button type="submit" className="w-full">
				Save Group
			</Button>
		</form>
	);
}
