import { App, Astal, Gdk, Gtk, type Widget } from 'astal/gtk3';
import { RecentApplications } from './RecentApps';
import { Folders } from './Folders';
import Applauncher from './AllApps';
import type { Entry } from 'astal/gtk3/widget';
import type Variable from 'astal/variable';

let stack: Gtk.Stack | null;
function getStartMenu() {
	return App.get_window('start-menu') as Astal.Window | null;
}
export function toggleStartMenu(gdkmonitor: Gdk.Monitor) {
	if (getStartMenu()?.is_visible()) {
		closeStartMenu();
	} else {
		showStartMenu(gdkmonitor);
	}
}
export function closeStartMenu() {
	App.get_window('start-menu')?.hide();
	stack?.set_visible_child_name("start-menu");
}
export function showStartMenu(gdkmonitor: Gdk.Monitor) {
	let startMenuWidget = getStartMenu();
	// Create window if necessary
	if (startMenuWidget == null) {
		startMenuWidget = StartMenu(gdkmonitor);
	}
	// Otherwise set the window's monitor if it's using the wrong monitor
	else if (startMenuWidget.gdkmonitor !== gdkmonitor) {
		startMenuWidget.set_gdkmonitor(gdkmonitor);
	}

	startMenuWidget.show();
}
export function StartMenu(gdkmonitor: Gdk.Monitor): Widget.Window {
	let searchBox: Entry;
	let searchText: Variable<string>;
	let window: Widget.Window;
	return (
		<window
			className="start-menu"
			name="start-menu"
			gdkmonitor={gdkmonitor}
			anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
			application={App}
			marginLeft={20}
			marginBottom={20}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressEvent={(_, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					if(stack.get_visible_child_name() === "start-menu"){
						closeStartMenu();
					} else {
						stack.set_visible_child_name("start-menu")
					}
					searchText.set("");
					searchBox.set_text("");
				} else if(!searchBox.isFocus){
					const charCode = Gdk.keyval_to_unicode(event.get_keyval()[1]);

					if(!charCode || charCode < 32 || charCode > 126) return;
					const character = String.fromCodePoint(charCode)
					const newText = searchText.get()+character;
					searchText.set(newText);
					searchBox.set_text(newText);
					searchBox.grab_focus();
					stack.set_visible_child_name("all-apps");
				}
			}}
			setup={(w) => {window = w;}}
		>
			<box className="start-menu-container">
				<stack
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					visibleChildName={'start-menu'}
					setup={(s) => {
						stack = s;
					}}
				>
					<box
						name="start-menu"
						className="start-menu-page"
						vertical
						spacing={16}
					>
						<RecentApplications
							showAllApps={() => {
								stack.set_visible_child_name('all-apps')
								searchBox.grab_focus_without_selecting();
							}}
						/>
						<Folders />
					</box>
					<box
						name="all-apps"
						className="start-menu-page"
						vertical
						spacing={8}
					>
						<button
							onClicked={() => {
								stack.set_visible_child_name('start-menu')
								searchText.set("");
								searchBox.set_text("");
							}}
							halign={Gtk.Align.START}
						>
							← Voltar
						</button>
						<Applauncher setup={(e, t) => {
							searchBox = e;
							searchText = t;
						}}/>
						
					</box>
				</stack>
			</box>
		</window>
	) as Widget.Window;
}
