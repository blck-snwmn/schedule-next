import AdminSidebar from "@/app/admin/_components/AdminSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AdminSidebar>{children}</AdminSidebar>;
}
