"use client";

import { updateTalent } from "@/actions/talent";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { DataTable } from "./DataTable";
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
		accessorKey: "dialog",
		header: "",
		cell: ({ row }) => {
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">
							<Pencil />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Talent</DialogTitle>
						</DialogHeader>
						<form action={updateTalent}>
							<Label htmlFor="id">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								defaultValue={row.original.name}
							/>
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
];
