import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import { RecentApplications } from './RecentApps';
import { Folders } from './Folders';
import Applauncher from './AllApps';
import type { Entry } from 'astal/gtk3/widget';
import type Variable from 'astal/variable';
let stack: Gtk.Stack | null;
function getStartMenu() {
	return App.get_window('start-menu') as Astal.Window | null;
}
export function toggleStartMenu() {
	if (getStartMenu()?.is_visible()) {
		closeStartMenu();
	} else {
		showStartMenu();
	}
}
export function closeStartMenu() {
	stack?.set_visible_child_name('empty');
	setTimeout(() => App.get_window('start-menu')?.hide(), 300)
}
export function showStartMenu() {
	getStartMenu().show();
}
export function StartMenu() {
	let searchBox: Entry;
	let searchText: Variable<string>;
	return (
		<window
			className="start-menu"
			name="start-menu"
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
			application={App}
			keymode={Astal.Keymode.EXCLUSIVE}
			onShow={() => {
				stack?.set_visible_child_name('start-menu')
			}}
			onHide={() => {
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
					visibleChildName={'empty'}
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
								searchBox.grab_focus_without_selecting();
							}}
						/>
						<Folders />
					</box>
					<box name="all-apps" className="start-menu-page page " vertical spacing={8}>
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
					<box name="empty"/>
				</stack>
			</box>
		</window>
	);
}
