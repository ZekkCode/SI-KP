/**
 * Helper to safely resolve user avatar URL,
 * supporting external URLs (Google OAuth profile pictures) and local storage paths.
 */
export function getAvatarUrl(avatarPath?: string | null): string | null {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }
    return `/storage/${avatarPath.replace(/^\/+/, '')}`;
}
