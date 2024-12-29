export type GlassCSSOptions = {
	blur?: number;
	transparency?: number;
	backgroundTintColor?: string;
	outlineOpacity?: number;
};

export function glassCss(options?: GlassCSSOptions): string {
	return `
        background: alpha(${options?.backgroundTintColor ?? '@base00'}, ${options?.transparency ?? 0.2});
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid alpha(${options?.backgroundTintColor ?? '@base00'}, ${options?.outlineOpacity ?? 0.3});
    `;
}
