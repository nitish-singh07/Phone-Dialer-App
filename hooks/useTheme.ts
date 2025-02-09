import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { toggleTheme } from "../store/slices/themeSlice";
import { getColors } from "../constants/colors";

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return {
    isDarkMode,
    colors,
    toggleTheme: () => dispatch(toggleTheme()),
  };
};
