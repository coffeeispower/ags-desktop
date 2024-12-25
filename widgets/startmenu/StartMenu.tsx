import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import type { Entry } from 'astal/gtk3/widget';
import type Variable from 'astal/variable';
import Applauncher from './AllApps';
import { Folders } from './Folders';
import { RecentApplications } from './RecentApps';
import { DASHBOARD_IS_OPEN } from '../dashboard/DashboardScreen';
let stack: Gtk.Stack | null;
export function toggleStartMenu() {
	App.toggle_window("start-menu");
}
export function closeStartMenu() {
	App.get_window('start-menu')?.hide()
}
export function showStartMenu() {
	App.get_window('start-menu')?.show()
	App.get_window('dashboard')?.hide();
}
export function StartMenu() {
	let searchBox: Entry;
	let searchText: Variable<string>;
	return (
		<window
			className="start-menu"
			name="start-menu"
			visible={false}
			namespace={'start-menu'}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
			application={App}
			keymode={Astal.Keymode.EXCLUSIVE}
			onHide={() => {
				searchBox.set_text('');
				searchText.set('');
			}}
			onShow={() => {
				stack?.set_visible_child_name("start-menu");
				DASHBOARD_IS_OPEN.set(false);
			}}
			onKeyPressEvent={(_, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					if (stack.get_visible_child_name() === 'start-menu') {
						closeStartMenu();
					} else {
						stack.set_visible_child_name('start-menu');
					}
					searchText.set('');
					searchBox.set_text('');
				} else if (!searchBox.isFocus) {
					const charCode = Gdk.keyval_to_unicode(event.get_keyval()[1]);

					if (!charCode || charCode < 32 || charCode > 126) return;
					const character = String.fromCodePoint(charCode);
					const newText = searchText.get() + character;
					console.log(newText);
					searchText.set(newText);
					searchBox.set_text(newText);
					searchBox.grab_focus();
					stack.set_visible_child_name('all-apps');
				}
			}}
		>
			<box className="start-menu-container">
				<stack
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					visibleChildName={'start-menu'}
					setup={s => {
						stack = s;
					}}
					transitionDuration={300}
				>
					<box
						name="start-menu"
						className="page start-menu-page"
						vertical
						spacing={16}
					>
						<RecentApplications
							showAllApps={() => {
								stack.set_visible_child_name('all-apps');
								searchText.set('');
								searchBox.set_text('');
								searchBox.grab_focus_without_selecting();
							}}
						/>
						<Folders />
					</box>
					<box
						name="all-apps"
						className="start-menu-page page "
						vertical
						spacing={8}
					>
						<button
							onClicked={() => {
								stack.set_visible_child_name('start-menu');
								searchText.set('');
								searchBox.set_text('');
							}}
							halign={Gtk.Align.START}
						>
							← Voltar
						</button>
						<Applauncher
							setup={(e, t) => {
								searchBox = e;
								searchText = t;
							}}
						/>
					</box>
				</stack>
			</box>
		</window>
	);
}
