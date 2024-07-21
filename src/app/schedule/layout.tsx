export default function Layout(props: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<div>
			{props.children}
			{props.modal}
		</div>
	);
}
