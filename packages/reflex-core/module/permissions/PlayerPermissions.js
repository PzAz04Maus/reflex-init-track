// PlayerPermissions.ts
// Shared permissions logic for Reflex systems
export function canEditActor(userId, actorOwnerId) {
    return userId === actorOwnerId;
}
export function canViewActor(userId, actorOwnerId) {
    // Example: allow all users to view, or restrict as needed
    return true;
}
// Extend with more permission checks as needed
