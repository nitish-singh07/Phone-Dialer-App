import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface DialButtonProps {
  digit: string;
  letters: string;
  onPress: (digit: string) => void;
}

export const DialButton: React.FC<DialButtonProps> = ({
  digit,
  letters,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.dialButton, { backgroundColor: colors.surface }]}
      onPress={() => onPress(digit)}
    >
      <Text style={[styles.dialButtonNumber, { color: colors.textPrimary }]}>
        {digit}
      </Text>
      {letters && (
        <Text
          style={[styles.dialButtonLetters, { color: colors.textSecondary }]}
        >
          {letters}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dialButton: {
    width: 85,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dialButtonNumber: {
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "400" : "500",
  },
  dialButtonLetters: {
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
  },
});
