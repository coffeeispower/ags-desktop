
export function formatSize(bytes: number) {
    if (bytes === 0) return '0B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / 1024 ** i).toFixed(2); // Formata com duas casas decimais

    return `${size}${units[i]}`;
}