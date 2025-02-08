import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getColors } from "../constants/Colors";

export const useTheme = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return {
    isDarkMode,
    colors,
  };
};
