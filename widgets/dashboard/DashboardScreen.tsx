import { App, Astal } from 'astal/gtk3';
import Variable from 'astal/variable';
import { closeStartMenu } from '../startmenu/StartMenu';
export const DASHBOARD_IS_OPEN = Variable(false);
DASHBOARD_IS_OPEN.subscribe((wasOpened) => {
	App.get_window("dashboard")?.set_visible(wasOpened);
})
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
			css={"font-size: 100px"}
			onShow={() => {
				DASHBOARD_IS_OPEN.set(true);
				closeStartMenu();
			}}
			onHide={() => {
				DASHBOARD_IS_OPEN.set(false)
			}}
		>
            DASHBOARD (TODO)
        </window>
	);
}
