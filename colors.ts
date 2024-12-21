import AstalIO from 'gi://AstalIO?version=0.1';
export type ColorScheme = {
	base00: string;
	base01: string;
	base02: string;
	base03: string;
	base04: string;
	base05: string;
	base06: string;
	base07: string;
	base08: string;
	base09: string;
	base0A: string;
	base0B: string;
	base0C: string;
	base0D: string;
	base0E: string;
	base0F: string;
};
export let colorScheme: ColorScheme;
function tryLoadFile(file: string): ColorScheme | null {
	const colorsFileString = AstalIO.read_file(file);
	if(!colorsFileString) {
		return null;
	}
	try {
		return JSON.parse(colorsFileString)
	} catch(e) {
		console.warn(`Failed to load colors file "${file}": ${e}`);
		return null;
	}
}
const fallback = {
	base00: '#1e1e2e',
	base01: '#181825',
	base02: '#313244',
	base03: '#45475a',
	base04: '#585b70',
	base05: '#cdd6f4',
	base06: '#f5e0dc',
	base07: '#b4befe',
	base08: '#f38ba8',
	base09: '#fab387',
	base0A: '#f9e2af',
	base0B: '#a6e3a1',
	base0C: '#94e2d5',
	base0D: '#89b4fa',
	base0E: '#cba6f7',
	base0F: '#f2cdcd',
};
colorScheme = tryLoadFile(`${SRC}/colors.json`);
if(!colorScheme) colorScheme = tryLoadFile('/etc/stylix/generated.json')
if(!colorScheme) colorScheme = fallback
