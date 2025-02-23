import { Gtk } from 'astal/gtk3';
import { glassCss } from '../../utils/glassmorphism-generator';

export function WidgetContainer(props: {
	child?: JSX.Element;
	children?: JSX.Element[];
	className: string;
}) {
	return (
		<box
			css={"background-color: @base00; border-radius: 1rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);"}
			className={props.className}
			valign={Gtk.Align.START}
			halign={Gtk.Align.START}
			vertical
		>
			{props.child}
			{props.children}
		</box>
	);
}
