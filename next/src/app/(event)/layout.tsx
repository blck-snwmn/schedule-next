export default function Layout(props: {
	children: React.ReactNode;
}) {
	return <div className="bg-gray-600 p-4 rounded">{props.children}</div>;
}
