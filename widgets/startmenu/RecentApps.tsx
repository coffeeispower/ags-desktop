import AstalApps from 'gi://AstalApps?version=0.1';
import { Gtk } from 'astal/gtk3';
import Variable from 'astal/variable';
import { FlowBox } from '../flowbox';
import { closeStartMenu } from './StartMenu';

function AppIcon({ app }: { app: AstalApps.Application }) {
	return (
		<button
			valign={Gtk.Align.START}
			className="app-icon"
			onClicked={() => {
				app.launch();
				updateRecentApps();
				closeStartMenu();
			}}
		>
			<box
				vertical
				spacing={20}
				hasFocus={false}
				canFocus={false}
				halign={Gtk.Align.CENTER}
				valign={Gtk.Align.CENTER}
			>
				<icon
					icon={app.iconName}
					halign={Gtk.Align.CENTER}
					valign={Gtk.Align.CENTER}
					className="app-button-icon"
				/>
				<label
					halign={Gtk.Align.CENTER}
					valign={Gtk.Align.CENTER}
					justify={Gtk.Justification.CENTER}
					hasFocus={false}
					canFocus={false}
					label={app.name.replaceAll(/\(.*\)/g, '').trim()}
					wrap
					maxWidthChars={10}
				/>
			</box>
		</button>
	);
}
export function getRecentApps() {
	const apps = new AstalApps.Apps();
	return apps
		.get_list()
		.filter(app => app.frequency)
		.sort((app1, app2) => Math.sign(app2.frequency - app1.frequency))
		.slice(0, 10);
}
const recentApps = Variable(getRecentApps());
export function updateRecentApps() {
	recentApps.set(getRecentApps());
}
export function RecentApplications(props: { showAllApps: () => void }) {
	return (
		<box vertical>
			<label
				className={'section-title'}
				halign={Gtk.Align.START}
				valign={Gtk.Align.START}
				label={'アプリ'}
			/>
			<box className="app-grid">
				<FlowBox
					hexpand={true}
					selectionMode={Gtk.SelectionMode.NONE}
					maxChildrenPerLine={6}
					valign={Gtk.Align.START}
					homogeneous
				>
					{recentApps(recentApps =>
						recentApps.map(app => <AppIcon app={app} />),
					)}
				</FlowBox>
			</box>
			<button
				className="show-all-apps"
				hexpand={false}
				halign={Gtk.Align.START}
				onClicked={props.showAllApps}
			>
				すべてを表示
			</button>
		</box>
	);
}
