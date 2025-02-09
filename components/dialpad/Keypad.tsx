import React from "react";
import { View, StyleSheet } from "react-native";
import { DialButton } from "./DialButton";
import { BUTTON_SIZE, BUTTON_MARGIN } from "../../constants/layout";

interface KeypadProps {
  onPress: (digit: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onPress }) => {
  const keypad = [
    { digit: "1", letters: "" },
    { digit: "2", letters: "ABC" },
    { digit: "3", letters: "DEF" },
    { digit: "4", letters: "GHI" },
    { digit: "5", letters: "JKL" },
    { digit: "6", letters: "MNO" },
    { digit: "7", letters: "PQRS" },
    { digit: "8", letters: "TUV" },
    { digit: "9", letters: "WXYZ" },
    { digit: "*", letters: "" },
    { digit: "0", letters: "+" },
    { digit: "#", letters: "" },
  ];

  return (
    <View style={styles.dialPadContainer}>
      {keypad.map((key) => (
        <DialButton
          key={key.digit}
          digit={key.digit}
          letters={key.letters}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dialPadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingTop: "2%",
    gap: BUTTON_MARGIN,
  },
});
