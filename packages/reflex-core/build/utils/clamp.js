// Utility clamp function for numeric bounds
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
