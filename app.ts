import { App, type Gdk, type Gtk } from 'astal/gtk3';
import { colorScheme } from './colors';
import style from './style.scss';
import { Bar } from './widgets/bar/Bar';
import './utils/neomorphism-generator';
import { StartMenu } from './widgets/startmenu/StartMenu';
App.start({
	icons: `${SRC}/icons`,
	css: `
        @define-color base00 #${colorScheme.base00};
        @define-color base01 #${colorScheme.base01};
        @define-color base02 #${colorScheme.base02};
        @define-color base03 #${colorScheme.base03};
        @define-color base04 #${colorScheme.base04};
        @define-color base05 #${colorScheme.base05};
        @define-color base06 #${colorScheme.base06};
        @define-color base07 #${colorScheme.base07};
        @define-color base08 #${colorScheme.base08};
        @define-color base09 #${colorScheme.base09};
        @define-color base0A #${colorScheme.base0A};
        @define-color base0B #${colorScheme.base0B};
        @define-color base0C #${colorScheme.base0C};
        @define-color base0D #${colorScheme.base0D};
        @define-color base0E #${colorScheme.base0E};
        @define-color base0F #${colorScheme.base0F};
        ${style}
    `,
	main() {
		StartMenu();
		// This creates all the widgets that need to appear in all desktops
		function createGlobalWidgets(monitor: Gdk.Monitor) {
			return [Bar(monitor)];
		}
		// Keep track of which widgets are for which monitors
		const monitorWidgetMap: Map<Gdk.Monitor, Gtk.Widget[]> = new Map();
		// Create widgets for the monitors that are already plugged in
		for (const gdkmonitor of App.get_monitors()) {
			monitorWidgetMap.set(gdkmonitor, createGlobalWidgets(gdkmonitor));
		}

		// React to monitor plugins
		App.connect('monitor-added', (_, gdkmonitor) => {
			monitorWidgetMap.set(gdkmonitor, createGlobalWidgets(gdkmonitor));
		});

		// React to monitor disconnections
		App.connect('monitor-removed', (_, gdkmonitor) => {
			for (const widget of monitorWidgetMap.get(gdkmonitor) ?? []) {
				widget.destroy();
			}
			monitorWidgetMap.delete(gdkmonitor);
		});
	},
});
