import Hyprland from 'gi://AstalHyprland?version=0.1';
import Variable from 'astal/variable';
export const hyprland = Hyprland.get_default();
export function toggleWorkspaceOverview() {
	return hyprland.dispatch('hyprexpo:expo', 'toggle');
}
export function openWorkspaceOverview() {
	return hyprland.dispatch('hyprexpo:expo', 'on');
}
export function closeWorkspaceOverview() {
	return hyprland.dispatch('hyprexpo:expo', 'off');
}
export function workspaceIsNotEmpty(workspace: Hyprland.Workspace): boolean {
	return workspace.clients.length > 0;
}
export function isWorkspaceSpecial(workspace: Hyprland.Workspace): boolean {
	return workspace.get_name().startsWith('special:');
}
export function filterNonEmptyWorkspaces(
	workspaces: Hyprland.Workspace[],
): Hyprland.Workspace[] {
	const nonEmptyWorkspaces = workspaces.filter(
		w => workspaceIsNotEmpty(w) && !isWorkspaceSpecial(w),
	);
	return nonEmptyWorkspaces;
}
export const workspaces = Variable(hyprland.workspaces);
for (const event of [
	'workspace-added',
	'workspace-removed',
	'client-added',
	'client-removed',
	'client-moved',
]) {
	hyprland.connect(event, () => {
		workspaces.set(hyprland.workspaces);
	});
}

export const focusedClient = Variable(hyprland.focusedClient);
export const focusedClientTitle = Variable(hyprland.focusedClient?.title);
hyprland.connect('event', (hyprland, event) => {
	if (['activewindowv2', 'windowtitlev2'].includes(event)) {
		focusedClient.set(hyprland.focusedClient);
		focusedClientTitle.set(hyprland.focusedClient?.title);
	}
});
