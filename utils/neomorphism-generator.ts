// Credit: Original code by Adam Giebl (https://github.com/adamgiebl/neumorphism)
// Converted to TypeScript for AGS by Tiago Dinis using ChatGPT

import { colorScheme } from "../colors";

// Define the input types for the function
export type NeomorphismOptions = {
	/**
	 * The base color for the neomorphic effect.
	 * Example: '#ffffff' or 'rgb(255, 255, 255)'.
	 */
	color: string;

	/**
	 * The distance for the shadow offset.
	 * Determines how far the shadow is cast from the element.
	 */
	distance: number;

	/**
	 * The amount of blur for the shadow.
	 * Higher values create softer shadows.
	 */
	blur: number;

	/**
	 * The border radius of the element.
	 * Values range from 0 (square) to a maximum radius, which typically creates a circle.
	 */
	radius: number;

	/**
	 * The shape of the neomorphic effect.
	 */
	shape: NeomorphismShape;

	/**
	 * The light source direction.
	 */
	activeLightSource: LightSource;

	/**
	 * The difference in luminance for the light and dark shadows.
	 * Determines the contrast of the shadows.
	 */
	intensity: number;
};

export enum NeomorphismShape {
	Flat = 0,
	Pressed = 1,
	Concave = 2,
	Convex = 3,
}

export enum LightSource {
	BottomRight = 1,
	BottomLeft = 2,
	TopLeft = 3,
	TopRight = 4,
}

export type NeomorphismStyles = {
	borderRadius: string;
	background: string;
	boxShadow: string;
};
const shapesMap = new Map([
	[
		LightSource.TopLeft,
		{
			positionXSign: 1,
			positionYSign: 1,
			angle: 145,
		},
	],
	[
		LightSource.TopRight,
		{
			positionXSign: -1,
			positionYSign: 1,
			angle: 225,
		},
	],
	[
		LightSource.BottomLeft,
		{
			positionXSign: -1,
			positionYSign: -1,
			angle: 315,
		},
	],
	[
		LightSource.BottomRight,
		{
			positionXSign: 1,
			positionYSign: -1,
			angle: 45,
		},
	],
]);
function adjustColorLuminance(hex: string, lum: number): string {
	// Validate hex string
	const sanitizedHex = String(hex).replace(/[^0-9a-f]/gi, '');
	const expandedHex =
		sanitizedHex.length < 6
			? `${sanitizedHex[0]}${sanitizedHex[0]}${sanitizedHex[1]}${sanitizedHex[1]}${sanitizedHex[2]}${sanitizedHex[2]}`
			: sanitizedHex;

	// Convert to decimal and change luminosity
	let rgb = '#';
	for (let i = 0; i < 3; i++) {
		const c = Number.parseInt(expandedHex.substr(i * 2, 2), 16);
		const clamped = Math.min(Math.max(0, c + (c * lum)), 255);
		const cString = Math.round(clamped).toString(16);
		rgb += `00${cString}`.substr(cString.length);
	}

	return rgb;
}

export function generateNeomorphismStyles(
	{
		color,
		distance,
		blur,
		radius,
		shape,
		activeLightSource,
		intensity,
	}: NeomorphismOptions,
): NeomorphismStyles {

	const darkColor = adjustColorLuminance(color, intensity * -1);
	const lightColor = adjustColorLuminance(color, intensity);

	const firstGradientColor =
		shape !== NeomorphismShape.Pressed
			? adjustColorLuminance(
					lightColor,
					shape === NeomorphismShape.Convex ? 0.5 : -0.1,
				)
			: color;
	const secondGradientColor =
		shape !== NeomorphismShape.Pressed
			? adjustColorLuminance(
					lightColor,
					shape === NeomorphismShape.Concave ? 0.5 : -0.1,
				)
			: color;

	const shapeSettings = shapesMap.get(activeLightSource);

	const borderRadius = `${radius}px`;
	const background =
		shape !== NeomorphismShape.Pressed
			? `linear-gradient(${shapeSettings.angle}deg, ${firstGradientColor}, ${secondGradientColor})`
			: color;
	const boxShadowPosition = shape === NeomorphismShape.Pressed ? 'inset ' : '';
	const firstBoxShadow = `${boxShadowPosition}${shapeSettings.positionXSign * distance}px ${shapeSettings.positionYSign * distance}px ${blur}px ${darkColor}`;
	const secondBoxShadow = `${boxShadowPosition}${-shapeSettings.positionXSign * distance}px ${-shapeSettings.positionYSign * distance}px ${blur}px ${lightColor}`;

	return {
		borderRadius,
		background,
		boxShadow: `${firstBoxShadow}, ${secondBoxShadow}`,
	};
}
export function generateNeomorphismStyleCode(options: NeomorphismOptions): string{
	const styles = generateNeomorphismStyles(options);
	
	const code= `
		background: ${styles.background};
		border-radius: ${styles.borderRadius};
		box-shadow: ${styles.boxShadow};
	`;
	console.log(code);
	return code;
}