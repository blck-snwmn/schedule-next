import AdminSidebar from "@/components/AdminSidebar";

export default function Layout({ children, editmodal }: { children: React.ReactNode, editmodal: React.ReactNode; }) {
	return <AdminSidebar>{children}{editmodal}</AdminSidebar>;
}
