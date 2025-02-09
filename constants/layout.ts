import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
};

export const BUTTON = {
  SIZE: Math.min(width * 0.27, 85),
  MARGIN: 10,
  BORDER_RADIUS: 42.5,
};

export const HEADER = {
  HEIGHT: 56,
};

export const TAB_BAR = {
  HEIGHT: 49,
};

export const MODAL = {
  BORDER_RADIUS: 20,
};

export const ANIMATION = {
  DURATION: 300,
};
