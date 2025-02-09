export const APP_CONFIG = {
  MAX_RECENT_CALLS: 100,
  MAX_BLOCKED_NUMBERS: 1000,
  CALL_HISTORY_STORAGE_KEY: "@call_history",
  BLOCKED_NUMBERS_STORAGE_KEY: "@blocked_numbers",
  THEME_STORAGE_KEY: "@theme_preference",
  DEFAULT_COUNTRY_CODE: "+1",
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  CONTACT_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

export const REGEX = {
  PHONE_NUMBER: /^\+?[\d\s-()]{10,}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const ERROR_MESSAGES = {
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_EMAIL: "Please enter a valid email address",
  PERMISSION_DENIED:
    "Permission denied. Please enable permissions in settings.",
  NETWORK_ERROR: "Network error. Please try again.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
};
