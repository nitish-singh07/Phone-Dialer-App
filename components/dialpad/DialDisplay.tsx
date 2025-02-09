import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { formatPhoneNumber } from "../../utils/formatting";

interface DialDisplayProps {
  number: string;
  onClear: () => void;
  onLongClear: () => void;
}

export const DialDisplay: React.FC<DialDisplayProps> = ({
  number,
  onClear,
  onLongClear,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.displayContainer, { backgroundColor: colors.surface }]}
    >
      <View style={styles.displayWrapper}>
        <Text
          style={[styles.displayText, { color: colors.textPrimary }]}
          numberOfLines={1}
          ellipsizeMode="head"
        >
          {number ? formatPhoneNumber(number) : "Enter number"}
        </Text>
      </View>
      {number.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          onLongPress={onLongClear}
          style={styles.clearButton}
        >
          <Ionicons
            name="backspace-outline"
            size={28}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  displayContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  displayWrapper: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  displayText: {
    fontSize: 36,
    letterSpacing: 1,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  clearButton: {
    position: "absolute",
    right: 20,
    padding: 10,
  },
});
