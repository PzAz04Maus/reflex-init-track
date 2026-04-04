// Utility clamp function for numeric bounds
export function clamp(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}
