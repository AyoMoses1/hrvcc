/**
 * Utility functions for user data
 */

/**
 * Get display name from user object
 * Handles both old format (name) and new format (firstName + lastName)
 */
export function getUserDisplayName(user: {
  name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  if (user.name) {
    return user.name;
  }
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`.trim();
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.lastName) {
    return user.lastName;
  }
  return 'User';
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: {
  name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  if (user.name) {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.firstName) {
    return user.firstName[0].toUpperCase();
  }
  if (user.lastName) {
    return user.lastName[0].toUpperCase();
  }
  return 'U';
}
