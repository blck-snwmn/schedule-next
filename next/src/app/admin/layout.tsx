import AdminSidebar from "@/components/AdminSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AdminSidebar>{children}</AdminSidebar>;
}
