"use client";

import { deleteEventAction } from "@/actions/event";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ScheduleEvent } from "@/services/type";
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
		accessorKey: "edit-dialog",
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
		accessorKey: "delete-dialog",
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
				<Link key={"xxxx"} href={"/admin/events/new"} className="mx-3">
					<Button variant="outline" className="mx-5">
						<SquarePlus size={18} />
					</Button>
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
