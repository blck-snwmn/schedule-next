export default function Layout(props: {
    children: React.ReactNode;
    // detail: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div>
            {props.children}
            {/* {props.detail} */}
            {props.modal}
        </div>
    )
}