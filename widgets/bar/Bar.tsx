import { App, Astal, Gtk, type Gdk } from 'astal/gtk3';
import Hyprland from 'gi://AstalHyprland';
import {
	filterNonEmptyWorkspaces,
	focusedClientTitle,
	toggleWorkspaceOverview,
	workspaces,
} from '../../utils/hyprland';
import { bind } from 'astal/binding';
import { toggleStartMenu } from '../startmenu/StartMenu';
import {
	generateNeomorphismStyleCode,
	LightSource,
	NeomorphismShape,
} from '../../utils/neomorphism-generator';
import { colorScheme, isLightTheme } from '../../colors';
import Variable from 'astal/variable';
import { exec } from 'astal/process';
import { getBestContrastColor } from '../../utils/contrast-checker';

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
	// const rightSideNeomorphismCss = generateNeomorphismStyleCode({
	// 	color: `#${colorScheme.base00}`,
	// 	blur: 10,
	// 	radius: 10,
	// 	activeLightSource: LightSource.TopLeft,
	// 	distance: 3,
	// 	intensity: 0.1,
	// 	shape: NeomorphismShape.Flat,
	// });
	const shadowCss = isLightTheme
		? `
		box-shadow: 0px 0px 10px alpha(@base02, 1);
		border-radius: 10px;
	`
		: `
		box-shadow: 0px 0px 10px alpha(black, 0.2);
		border-radius: 10px;
	`;
	return (
		<window
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			application={App}
			css={`background-color: #${colorScheme.base00}`}
		>
			<centerbox css="padding-left: 20px; padding-bottom: 10px; padding-top: 10px;">
				<box className="right-side" css={shadowCss} halign={Gtk.Align.START}>
					<StartMenuButton gdkmonitor={gdkmonitor} />
					<OpenWorkspaceOverviewButton />
				</box>
				{focusedClientTitle(title =>
					title ? (
						<box className="window-title" spacing={16} css={shadowCss}>
							󰘔 {title}
						</box>
					) : (
						<box />
					),
				)}

				<box
					className="clock"
					halign={Gtk.Align.END}
					css={shadowCss}
					marginEnd={20}
				>
					{Variable(exec('date')).poll(1000, 'date')()}
				</box>
			</centerbox>
		</window>
	);
}
