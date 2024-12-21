import { Gtk } from 'astal/gtk3';
import { FlowBox } from '../flowbox';
import GLib from 'gi://GLib?version=2.0';
import { execAsync } from 'astal/process';
import { closeStartMenu } from './StartMenu';

function FolderIcon(props: { icon: string; name: string; folderPath: string; color: string }) {
    const folderPath = props.folderPath.replaceAll("~/", `${GLib.getenv("HOME")}/`)
	return (
		<button valign={Gtk.Align.START} className="folder-icon" css={`color: ${props.color};`} onClicked={() => {
            execAsync(`nautilus ${folderPath}`);
            closeStartMenu();
        }}>
			<box
				vertical
				spacing={20}
				hasFocus={false}
				canFocus={false}
				halign={Gtk.Align.CENTER}
				valign={Gtk.Align.CENTER}
			>
				<icon icon={props.icon} />
				<label
					halign={Gtk.Align.CENTER}
					justify={Gtk.Justification.CENTER}
					hasFocus={false}
					canFocus={false}
					label={props.name}
					wrap
					maxWidthChars={10}
				/>
			</box>
		</button>
	);
}
export function Folders() {
	return (
		<box className="folders-container" vertical>
			<label label="Pastas" className="section-title" halign={Gtk.Align.START}/>
            <FlowBox
                hexpand={true}
                selectionMode={Gtk.SelectionMode.NONE}
                maxChildrenPerLine={6}
                valign={Gtk.Align.START}
                homogeneous
            >
                <FolderIcon folderPath='~/' icon='house' name='/home' color="@base08"/>
                <FolderIcon folderPath='~/Downloads' icon='downloads' name='Downloads' color="@base0D"/>
                <FolderIcon folderPath='~/Projects' icon='projects' name='Projetos' color="@base0B"/>
            </FlowBox>
		</box>
	);
}
