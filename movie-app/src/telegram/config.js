export const MOBILE_TELEGRAM_PLATFORMS = ["android", "ios"];
export const BLOCKED_TELEGRAM_PLATFORMS = [
  "tdesktop",
  "web",
  "macos",
  "windows",
  "linux",
];

export const TELEGRAM_AUTH_ENDPOINT =
  import.meta.env.VITE_TELEGRAM_AUTH_ENDPOINT || "/api/auth/telegram";

export const IS_TELEGRAM_STRICT =
  import.meta.env.PROD && import.meta.env.VITE_TELEGRAM_STRICT !== "false";
