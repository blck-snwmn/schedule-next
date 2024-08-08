"use client";

import { deleteEventAction } from "@/actions/event";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, SquarePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "./CategoryBadge";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";

interface EventListProps {
	events: ScheduleEvent[];
}

export const EventList = ({ events }: EventListProps) => {
	return <DataTable columns={eventColumns} data={events} />;
};

export const eventColumns: ColumnDef<ScheduleEvent>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			return <CategoryBadge category={row.original.category} />;
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<div className="w-30">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="-ml-3"
					>
						Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			return (
				<div className="max-w-60 truncate">{row.original.description}</div>
			);
		},
	},
	{
		accessorKey: "dialog",
		header: () => {
			return <div className="w-10">Edit</div>;
		},
		cell: ({ row }) => {
			return (
				<Link key={row.original.id} href={`/admin/events/${row.original.id}`}>
					<Pencil size={12} />
				</Link>
			);
		},
	},
	{
		accessorKey: "dialog",
		header: () => {
			return <div className="w-12">Delete</div>;
		},
		cell: ({ row }) => {
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">
							<Trash2 size={12} />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Event?</DialogTitle>
						</DialogHeader>
						<div>ID: {row.original.id}</div>
						<div>Name: {row.original.name}</div>
						<DialogFooter className="mt-5">
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button
								variant="default"
								onClick={async () => {
									await deleteEventAction(row.original.id);
								}}
							>
								OK
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<>
			<div className="flex items-center">
				<Input
					placeholder="Filter talent name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(e) =>
						table.getColumn("name")?.setFilterValue(e.target.value)
					}
				/>
				<Link key={"xxxx"} href={"/admin/events/new"}>
					<SquarePlus size={18} />
				</Link>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

interface EventFormProps<T> {
	event?: ScheduleEvent;
	onSubmit: (formData: FormData) => Promise<T>;
}

function EventForm<T>({ event, onSubmit }: EventFormProps<T>) {
	// const [schedules, setSchedules] = useState(event?.schedules || []);

	// const handleSubmit = (e) => {
	//     e.preventDefault();
	//     const formData = new FormData(e.target);
	//     formData.append('schedules', JSON.stringify(schedules));
	//     onSubmit(formData);
	// };

	// const addSchedule = () => {
	//     setSchedules([...schedules, { id: Date.now().toString(), name: '', startAt: '', endAt: '', status: 'SCHEDULED' }]);
	// };

	return (
		<form action={onSubmit}>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="name">Event Name</Label>
					<Input id="name" name="name" defaultValue={event?.name} required />
				</div>
				<div>
					<Label htmlFor="category">Category</Label>
					<Input
						id="category"
						name="category"
						defaultValue={event?.category}
						required
					/>
				</div>
				<div className="col-span-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						defaultValue={event?.description}
					/>
				</div>
				<div className="col-span-2">
					<Label htmlFor="thumbnail">Thumbnail URL</Label>
					<Input
						id="thumbnail"
						name="thumbnail"
						type="url"
						defaultValue={event?.thumbnail}
					/>
				</div>
				<div className="col-span-2">
					<Label>Talents</Label>
					<div className="flex">
						{event?.talents?.map((talent) => (
							<Toggle
								key={talent.id}
							// pressed={selectedTalents.includes(talent.id)}
							// onPressedChange={() => toggleTalent(talent.id)}
							>
								{talent.name}
							</Toggle>
						))}
					</div>
					{/* <Select name="talents" multiple>
                        <SelectTrigger>
                            <SelectValue placeholder="Select talents" />
                        </SelectTrigger>
                        <SelectContent>
                            {talents.map((talent) => (
                                <SelectItem key={talent.id} value={talent.id}>{talent.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
				</div>
			</div>

			<div className="mt-4">
				<Label>Schedules</Label>
				{/* {schedules.map((schedule, index) => (
                    <div key={schedule.id} className="grid grid-cols-3 gap-2 mt-2">
                        <Input
                            placeholder="Schedule Name"
                            value={schedule.name}
                            onChange={(e) => {
                                const newSchedules = [...schedules];
                                newSchedules[index].name = e.target.value;
                                setSchedules(newSchedules);
                            }}
                        />
                        <DateTimePicker
                            date={new Date(schedule.startAt)}
                            setDate={(date) => {
                                const newSchedules = [...schedules];
                                newSchedules[index].startAt = date.toISOString();
                                setSchedules(newSchedules);
                            }}
                        />
                        <DateTimePicker
                            date={new Date(schedule.endAt)}
                            setDate={(date) => {
                                const newSchedules = [...schedules];
                                newSchedules[index].endAt = date.toISOString();
                                setSchedules(newSchedules);
                            }}
                        />
                    </div>
                ))} */}
				{/* <Button type="button" onClick={addSchedule} className="mt-2">
                    <Plus size={16} className="mr-2" /> Add Schedule
                </Button> */}
			</div>

			<DialogFooter className="mt-6">
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<Button type="submit">Save Event</Button>
			</DialogFooter>
		</form>
	);
}
