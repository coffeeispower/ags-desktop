import { App, Astal, Gtk } from 'astal/gtk3';
import Variable from 'astal/variable';
import { FlowBox, FlowBoxChild } from '../flowbox';
import { closeStartMenu } from '../startmenu/StartMenu';
import { ResourceMonitorWidget } from './widgets/resource-monitor/ResourceMonitorWidget';
import { DeeplWidget } from './widgets/deepl/DeeplWidget';
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
			<box valign={Gtk.Align.CENTER} css={"padding: 3rem"} halign={Gtk.Align.CENTER} spacing={96} vertical>
				<box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} spacing={70}>
					<ResourceMonitorWidget />
					<DeeplWidget />
				</box>
			</box>
			</scrollable>
		</window>
	);
}
