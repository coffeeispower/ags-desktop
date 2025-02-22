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
			<box className={'dashboard-container'}>
				<FlowBox selectionMode={Gtk.SelectionMode.NONE}>
					<FlowBoxChild canFocus={false}>
						<ResourceMonitorWidget />
					</FlowBoxChild>
					<FlowBoxChild canFocus={false}>
						<DeeplWidget />
					</FlowBoxChild>
				</FlowBox>
			</box>
		</window>
	);
}
