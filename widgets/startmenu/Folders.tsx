import GLib from 'gi://GLib?version=2.0';
import { Gtk } from 'astal/gtk3';
import { execAsync } from 'astal/process';
import { FlowBox } from '../flowbox';
import { closeStartMenu } from './StartMenu';

function FolderIcon(props: {
	icon: string;
	name: string;
	folderPath: string;
	color: string;
	iconClassName: string;
}) {
	const folderPath = props.folderPath.replaceAll(
		'~/',
		`${GLib.getenv('HOME')}/`,
	);
	return (
		<button
			valign={Gtk.Align.START}
			className="folder-icon"
			css={`color: ${props.color};`}
			onClicked={() => {
				execAsync(`nautilus ${folderPath}`);
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
				<label
					halign={Gtk.Align.CENTER}
					label={props.icon}
					className={`folder-button-icon ${props.iconClassName}`}
				/>

				<label
					halign={Gtk.Align.CENTER}
					valign={Gtk.Align.END}
					justify={Gtk.Justification.CENTER}
					hasFocus={false}
					canFocus={false}
					label={props.name}
				/>
			</box>
		</button>
	);
}
export function Folders() {
	return (
		<box className="folders-container" vertical>
			<label
				label="フォルダー"
				className="section-title"
				halign={Gtk.Align.START}
			/>
			<FlowBox
				hexpand={true}
				selectionMode={Gtk.SelectionMode.NONE}
				maxChildrenPerLine={6}
				valign={Gtk.Align.START}
				homogeneous
			>
				<FolderIcon
					folderPath="~/"
					icon=""
					name="ホーム"
					color="@base08"
					iconClassName="home-icon"
				/>
				<FolderIcon
					folderPath="~/Downloads"
					icon=""
					name="ダウンロード"
					iconClassName="downloads-icon"
					color="@base0D"
				/>
				<FolderIcon
					folderPath="~/Projects"
					icon=""
					name="プロジェクト"
					iconClassName="projects-icon"
					color="@base0B"
				/>
			</FlowBox>
		</box>
	);
}
