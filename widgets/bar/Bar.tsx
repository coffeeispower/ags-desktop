import { bind } from 'astal/binding';
import { App, Astal, type Gdk, Gtk } from 'astal/gtk3';
import Variable from 'astal/variable';
import { colorScheme } from '../../colors';
import { formatDate, formatTime, getWeekday } from '../../utils/dates';
import {
	filterNonEmptyWorkspaces,
	focusedClientTitle,
	toggleWorkspaceOverview,
	workspaces,
} from '../../utils/hyprland';
import { toggleStartMenu } from '../startmenu/StartMenu';
import { DASHBOARD_IS_OPEN } from '../dashboard/DashboardScreen';

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
export function StartMenuButton() {
	return (
		<button
			className="start-menu"
			focusOnClick={false}
			onClicked={() => toggleStartMenu()}
		>
			<label label="" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}/>
		</button>
	);
}
export function Bar(gdkmonitor: Gdk.Monitor) {
	return (
		<window
			gdkmonitor={gdkmonitor}
			name={'bar'}
			namespace={'bar'}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			application={App}
			css={`background-color: #${colorScheme.base00}`}
		>
			<centerbox css="padding-left: 20px; padding-bottom: 10px; padding-top: 10px; min-height: 3.25rem">
				{DASHBOARD_IS_OPEN(dashboardIsOpen =>
					dashboardIsOpen ? (
						<box css="color: @base05; margin-left: 20px;" valign={Gtk.Align.CENTER}>
							<label css="font-weight: 600; font-size: 1.5rem;" label="Dashboard do Sistema" valign={Gtk.Align.END} />
						</box>
					) : (
						<box className="right-side" halign={Gtk.Align.START}>
							<StartMenuButton gdkmonitor={gdkmonitor} />
							<OpenWorkspaceOverviewButton />
							{focusedClientTitle(title =>
								title ? (
									<box className="window-title" spacing={16}>
										{title}
									</box>
								) : "",
							)}
						</box>
					),
				)}

				<box />

				<box className="clock" halign={Gtk.Align.END} valign={Gtk.Align.FILL}>
					<box vertical valign={Gtk.Align.CENTER} marginEnd={10}>
						<label
							halign={Gtk.Align.END}
							label={Variable('').poll(60000, () => formatTime())()}
						/>
						<label
							halign={Gtk.Align.END}
							label={Variable('').poll(
								60000,
								() => `${getWeekday('long')}, ${formatDate()}`,
							)()}
						/>
					</box>
					<button
						className="toggle-dashboard-button"
						valign={Gtk.Align.CENTER}
						onClicked={() => {
							DASHBOARD_IS_OPEN.set(!DASHBOARD_IS_OPEN.get());
						}}
					>
						<label label="󰕮" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}/>
					</button>
				</box>
			</centerbox>
		</window>
	);
}
