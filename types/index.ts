export interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    id: string;
    number: string;
    label?: string;
  }>;
  email?: string;
  image?: string;
}

export interface CallLogEntry {
  id: string;
  phoneNumber: string;
  name?: string;
  type: "incoming" | "outgoing" | "missed";
  timestamp: number;
  duration: number;
}

export interface BlockedContact {
  id: string;
  phoneNumber: string;
  name?: string;
  dateBlocked: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  white: string;
  black: string;
  transparent: string;
  overlay: string;
}

export type PermissionStatus = "granted" | "denied" | "undetermined";

export interface Permissions {
  contacts: boolean;
  callLog: boolean;
}

export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}
