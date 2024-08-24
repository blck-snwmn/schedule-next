"use client";

import {
	createTalentAction,
	deleteTalentAction,
	updateTalentAction,
} from "@/actions/talent";
import type { Talent } from "@/services/type";
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
import { useState } from "react";
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

interface TalentListProps {
	talents: Talent[];
}

export const TalentList = ({ talents }: TalentListProps) => {
	return <DataTable columns={talentColumns} data={talents} />;
};

export const talentColumns: ColumnDef<Talent>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<div className="w-60">
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
		accessorKey: "sortKey",
		header: "sortKey",
	},
	{
		accessorKey: "dialog",
		header: () => {
			return <div className="w-10">Edit</div>;
		},
		cell: ({ row }) => {
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">
							<Pencil size={12} />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Talent</DialogTitle>
						</DialogHeader>
						<form action={updateTalentAction}>
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									defaultValue={row.original.name}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sortKey">SortKey</Label>
								<Input
									id="sortKey"
									name="sortKey"
									type="text"
									defaultValue={row.original.sortKey ?? ""}
								/>
							</div>
							<Input type="hidden" name="id" value={row.original.id} />
							<DialogFooter className="mt-5">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<DialogClose asChild>
									{/* 現在成功失敗に関係なくダイアログを閉じるので注意 */}
									<Button variant="default" type="submit">
										Save
									</Button>
								</DialogClose>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
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
							<DialogTitle>Delete Talent?</DialogTitle>
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
									await deleteTalentAction(row.original.id);
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
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" className="mx-5">
							<SquarePlus size={18} />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Talent</DialogTitle>
						</DialogHeader>
						<form action={createTalentAction}>
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" name="name" type="text" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="sortKey">SortKey</Label>
								<Input id="sortKey" name="sortKey" type="text" />
							</div>
							<DialogFooter className="mt-5">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<DialogClose asChild>
									{/* 現在成功失敗に関係なくダイアログを閉じるので注意 */}
									<Button variant="default" type="submit">
										Save
									</Button>
								</DialogClose>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
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
