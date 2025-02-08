import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleTheme } from "../store/themeSlice";
import { getColors } from "../constants/Colors";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <TouchableOpacity
      onPress={() => dispatch(toggleTheme())}
      style={{ marginRight: 15 }}
    >
      <Ionicons
        name={isDarkMode ? "sunny" : "moon"}
        size={24}
        color={colors.textPrimary}
      />
    </TouchableOpacity>
  );
}
