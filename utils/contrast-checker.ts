/**
 * Determines whether black or white has better contrast with a given color.
 * @param {string} color - A hex color code (e.g., "#ffffff" or "#000000").
 * @returns {string} - "black" or "white", depending on which has better contrast.
 */
export function getBestContrastColor(color: string) {
	// Ensure the color is in 6-character hex format
	const colorWithoutHash = color.replace(/^#/, '');
	const sanitizedHex =
		colorWithoutHash.length === 3
			? colorWithoutHash
					.split('')
					.map(c => c + c)
					.join('')
			: colorWithoutHash;
	// Convert hex to RGB
	const r = Number.parseInt(sanitizedHex.substring(0, 2), 16) / 255;
	const g = Number.parseInt(sanitizedHex.substring(2, 4), 16) / 255;
	const b = Number.parseInt(sanitizedHex.substring(4, 2), 16) / 255;
	// Calculate relative luminance
	const calculateLuminance = channel =>
		channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
	const luminance =
		0.2126 * calculateLuminance(r) +
		0.7152 * calculateLuminance(g) +
		0.0722 * calculateLuminance(b);

	// Contrast ratios for white and black
	const whiteContrast = (1 + 0.05) / (luminance + 0.05);
	const blackContrast = (luminance + 0.05) / (0 + 0.05);

	// Return the color with the higher contrast
	return whiteContrast > blackContrast ? 'white' : 'black';
}
