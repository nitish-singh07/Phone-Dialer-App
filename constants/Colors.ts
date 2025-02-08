export const lightColors = {
  primary: "#4CAF50", // Green
  secondary: "#8BC34A",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceVariant: "#FAFAFA",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#BDBDBD",
  error: "#D32F2F", // Red
  success: "#388E3C",
  warning: "#F57C00",
  info: "#1976D2",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const darkColors = {
  primary: "#69F0AE",
  secondary: "#B9F6CA",
  background: "#121212",
  surface: "#1E1E1E",
  surfaceVariant: "#2D2D2D",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#404040",
  error: "#FF5252",
  success: "#69F0AE",
  warning: "#FFB74D",
  info: "#64B5F6",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  overlay: "rgba(0, 0, 0, 0.7)",
};

export type ColorScheme = typeof lightColors;

export const getColors = (isDarkMode: boolean): ColorScheme =>
  isDarkMode ? darkColors : lightColors;

export default {
  light: lightColors,
  dark: darkColors,
  getColors,
};
