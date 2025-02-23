import { App, Astal, Gtk } from 'astal/gtk3';
import Variable from 'astal/variable';
import { closeStartMenu } from '../startmenu/StartMenu';
import { ResourceMonitorWidget } from './widgets/resource-monitor/ResourceMonitorWidget';
import { DeeplWidget } from './widgets/deepl/DeeplWidget';
import MprisPlayers from './widgets/media-player/MediaPlayer';
import { VolumeWidget } from './widgets/volume/Volume';
export const DASHBOARD_IS_OPEN = Variable(false);
DASHBOARD_IS_OPEN.subscribe(wasOpened => {
	App.get_window('dashboard')?.set_visible(wasOpened);
});
export function DashboardScreen() {
	return (
		<window
			visible={DASHBOARD_IS_OPEN.get()}
			name="dashboard"
			namespace={'dashboard'}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT |
				Astal.WindowAnchor.BOTTOM
			}
			keymode={Astal.Keymode.EXCLUSIVE}
			application={App}
			onShow={() => {
				DASHBOARD_IS_OPEN.set(true);
				closeStartMenu();
			}}
			onHide={() => {
				DASHBOARD_IS_OPEN.set(false);
			}}
		>
			<scrollable vexpand hexpand>
				<box
					valign={Gtk.Align.CENTER}
					css={'padding: 3rem'}
					halign={Gtk.Align.CENTER}
					spacing={96}
					vertical
				>
					<box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} spacing={70}>
						<ResourceMonitorWidget />
						<DeeplWidget />
						<box valign={Gtk.Align.FILL} halign={Gtk.Align.CENTER} spacing={24}>
							<MprisPlayers />
							<VolumeWidget />
						</box>
					</box>

				</box>
			</scrollable>
		</window>
	);
}
