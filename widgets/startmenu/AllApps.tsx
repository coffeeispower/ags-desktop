import AstalApps from 'gi://AstalApps?version=0.1';
import { Gtk } from 'astal/gtk3';
import type { Entry } from 'astal/gtk3/widget';
import Variable from 'astal/variable';
import { updateRecentApps } from './RecentApps';
import { closeStartMenu } from './StartMenu';

function AppButton({ app }: { app: AstalApps.Application }) {
	return (
		<button
			className="AppButton"
			onClicked={() => {
				app.launch();
				closeStartMenu();
				updateRecentApps();
			}}
		>
			<box spacing={16}>
				<icon className="app-button-icon" icon={app.iconName} />
				<box valign={Gtk.Align.CENTER} vertical>
					<label className="name" truncate xalign={0} label={app.name} />
					{app.description && (
						<label
							className="description"
							wrap
							xalign={0}
							label={app.description}
						/>
					)}
				</box>
			</box>
		</button>
	);
}

export default function Applauncher(props: {
	setup?: (e: Entry, text: Variable<string>) => void;
}) {
	const { CENTER } = Gtk.Align;
	const apps = new AstalApps.Apps();

	const text = Variable('');
	const list = text(text => (text ? apps.fuzzy_query(text) : apps.get_list()));
	const onEnter = () => {
		apps.fuzzy_query(text.get())?.[0].launch();
		updateRecentApps();
		closeStartMenu();
	};

	return (
		<box
			widthRequest={500}
			className="Applauncher"
			vertical
			halign={Gtk.Align.FILL}
		>
			<entry
				placeholderText="Search"
				text={text()}
				onChanged={self => text.set(self.text)}
				onActivate={onEnter}
				setup={e => {
					props.setup(e, text);
				}}
			/>
			<scrollable vexpand>
				<box spacing={6} vertical>
					{list.as(list => list.map(app => <AppButton app={app} />))}
				</box>
				<box
					halign={CENTER}
					className="not-found"
					vertical
					spacing={16}
					visible={list.as(l => l.length === 0)}
				>
					<icon icon="system-search-symbolic" />
					<label label="No match found" />
				</box>
			</scrollable>
		</box>
	);
}
