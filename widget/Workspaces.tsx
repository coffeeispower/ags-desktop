import { App, Astal, type Gdk } from "astal/gtk3"

export function Workspaces(gdkmonitor: Gdk.Monitor) {
    return <window
        className="workspaces-window"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP
            | Astal.WindowAnchor.LEFT}
        application={App}
    >
        HELLO WORLD
    </window>
}
