import { Gtk } from "astal/gtk3";
import { glassCss } from "../../utils/glassmorphism-generator";

export function WidgetContainer(props: {child?: JSX.Element; children?: JSX.Element[]; className: string}) {
    return <box css={glassCss({
        transparency: 0.7
    })} className={props.className} valign={Gtk.Align.START} halign={Gtk.Align.START} vertical>
        {props.child}
        {props.children}
    </box>;
}