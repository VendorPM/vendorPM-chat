export const USER_ROLE = {
  ADMIN: 'admin',
  ENTERPRISE_LEADER: 'leader',
  GENERAL: 'general',
  GUEST: 'guest',
  PM: 'pm',
  VENDOR: 'vendor',
} as const;

export type UserRole = keyof typeof USER_ROLE;
