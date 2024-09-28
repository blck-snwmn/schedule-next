import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export const Menu = () => {
	const groupLinks = [
		{
			group: "イベント",
			links: [
				{ href: "/events", label: "Events" },
				{ href: "/schedules", label: "Schedules" },
				{ href: "/weekly", label: "Weekly" },
			],
		},
		{
			group: "登録",
			links: [
				{ href: "/admin/talents", label: "Talents" },
				{ href: "/admin/groups", label: "Groups" },
				{ href: "/admin/events", label: "Events" },
			],
		},
	];
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>
					<MenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent
				className="w-[400px] sm:w-[540px] bg-gray-800"
				side={"left"}
			>
				<SheetHeader>
					<SheetTitle className=" text-white">Navigation</SheetTitle>
					<SheetDescription>
						Click a link to navigate to the page
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-4">
					{groupLinks.map((group) => (
						<div className="flex flex-col gap-4" key={group.group}>
							<p>{group.group}</p>
							{group.links.map((link) => (
								<Link href={link.href} key={link.href}>
									<SheetClose asChild>
										<Button className="w-72">{link.label}</Button>
									</SheetClose>
								</Link>
							))}
						</div>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
};
