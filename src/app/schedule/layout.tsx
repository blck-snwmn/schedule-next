export default function Layout({
    children,
    detail,
}: Readonly<{
    children: React.ReactNode;
    detail: React.ReactNode;
}>) {
    return (
        <div className="flex">
            {children}
            {detail}
        </div>
    )
}