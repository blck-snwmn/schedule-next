"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/admin/talents", label: "タレント" },
	{ href: "/admin/events", label: "イベント" },
];

export default function AdminSidebar({
	children,
}: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex h-screen bg-background">
			<nav className="w-64 border-r border-border">
				<div className="p-4">
					<h1 className="text-xl font-semibold text-foreground">管理画面</h1>
				</div>
				<ul className="space-y-2 p-4">
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									"block px-4 py-2 rounded-md text-sm font-medium transition-colors",
									pathname.startsWith(item.href)
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								)}
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<main className="flex-1 overflow-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	);
}
