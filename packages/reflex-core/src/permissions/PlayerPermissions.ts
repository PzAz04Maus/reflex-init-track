// PlayerPermissions.ts
// Shared permissions logic for Reflex systems

export function canEditActor(userId: string, actorOwnerId: string | null | undefined): boolean {
  return userId === actorOwnerId;
}

export function canViewActor(userId: string, actorOwnerId: string | null | undefined): boolean {
  // Example: allow all users to view, or restrict as needed
  return true;
}

// Extend with more permission checks as needed
