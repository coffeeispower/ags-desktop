import { App, Astal, type Gdk } from 'astal/gtk3';
import Hyprland from 'gi://AstalHyprland';
import {
	filterNonEmptyWorkspaces,
	toggleWorkspaceOverview,
	workspaces,
} from '../../utils/hyprland';
import { bind } from 'astal/binding';
import { toggleStartMenu } from '../startmenu/StartMenu';

export function OpenWorkspaceOverviewButton() {
	return (
		<button
			className="workspace-overview"
			focusOnClick={false}
			onClicked={() => toggleWorkspaceOverview()}
		>
			{bind(workspaces).as(
				workspaces => `\uebeb   ${filterNonEmptyWorkspaces(workspaces).length}`,
			)}
		</button>
	);
}
export function StartMenuButton({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
	return (
		<button
			className="start-menu"
			focusOnClick={false}
			onClicked={() => toggleStartMenu(gdkmonitor)}
		>
			{''}
		</button>
	);
}
export function Bar(gdkmonitor: Gdk.Monitor) {
	return (
		<window
			className="bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT| Astal.WindowAnchor.RIGHT}
			application={App}
			marginLeft={20}
			marginBottom={10}
		>
			<box>
				<StartMenuButton gdkmonitor={gdkmonitor} />
				<OpenWorkspaceOverviewButton />
			</box>
		</window>
	);
}
