export const lightColors = {
  primary: "#4CAF50",
  secondary: "#8BC34A",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceVariant: "#FAFAFA",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#BDBDBD",
  error: "#D32F2F",
  success: "#388E3C",
  warning: "#F57C00",
  info: "#1976D2",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const darkColors = {
  primary: "#66BB6A",
  secondary: "#9CCC65",
  background: "#121212",
  surface: "#1E1E1E",
  surfaceVariant: "#2C2C2C",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#404040",
  error: "#EF5350",
  success: "#4CAF50",
  warning: "#FFA726",
  info: "#42A5F5",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  overlay: "rgba(0, 0, 0, 0.7)",
};

export type ColorScheme = typeof lightColors;

export const getColors = (isDarkMode: boolean): ColorScheme =>
  isDarkMode ? darkColors : lightColors;
