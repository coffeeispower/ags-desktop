export function getWeekday(format: 'long' | 'short' | 'narrow' = 'long') {
	const now = new Date();
	return new Intl.DateTimeFormat(undefined, { weekday: format }).format(now);
}

export function formatDate() {
	const now = new Date();
	return new Intl.DateTimeFormat('pt-PT', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(now);
}
export function formatTime() {
	const now = new Date();
	return new Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	}).format(now);
}
