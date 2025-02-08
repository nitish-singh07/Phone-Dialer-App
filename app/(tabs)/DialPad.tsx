import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDialedNumber, clearNumber } from "../../store/dialerSlice";
import { addCallLog } from "../../store/historySlice";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";
import type { RootState } from "../../store";

const { width, height } = Dimensions.get("window");
const BUTTON_SIZE = Math.min(width * 0.27, 85);
const BUTTON_MARGIN = 10;

const DialPad: React.FC = () => {
  const dispatch = useDispatch();
  const dialedNumber = useSelector((state: RootState) => state.dialer.number);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  const handlePress = (digit: string) => {
    dispatch(addDialedNumber(dialedNumber + digit));
  };

  const handleClear = () => {
    if (dialedNumber.length > 0) {
      dispatch(addDialedNumber(dialedNumber.slice(0, -1)));
    }
  };

  const handleLongClear = () => {
    dispatch(clearNumber());
  };

  const handleCall = () => {
    if (dialedNumber) {
      dispatch(
        addCallLog({
          id: Date.now().toString(),
          number: dialedNumber,
          type: "outgoing",
          time: new Date().toLocaleTimeString(),
        })
      );
      Linking.openURL(`tel:${dialedNumber}`);
    }
  };

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

  const formatPhoneNumber = (number: string) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}></View>

      <View
        style={[styles.displayContainer, { backgroundColor: colors.surface }]}
      >
        <View style={styles.displayWrapper}>
          <Text
            style={[styles.displayText, { color: colors.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="head"
          >
            {dialedNumber ? formatPhoneNumber(dialedNumber) : "Enter number"}
          </Text>
        </View>
        {dialedNumber.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            onLongPress={handleLongClear}
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

      <View style={styles.dialPadContainer}>
        {keypad.map(({ digit, letters }) => (
          <TouchableOpacity
            key={digit}
            style={[styles.dialButton, { backgroundColor: colors.surface }]}
            onPress={() => handlePress(digit)}
          >
            <Text
              style={[styles.dialButtonNumber, { color: colors.textPrimary }]}
            >
              {digit}
            </Text>
            {letters && (
              <Text
                style={[
                  styles.dialButtonLetters,
                  { color: colors.textSecondary },
                ]}
              >
                {letters}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomContainer}>
        {!dialedNumber && (
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.callButton,
            !dialedNumber && styles.callButtonDisabled,
            { backgroundColor: dialedNumber ? colors.primary : colors.border },
          ]}
          onPress={handleCall}
          disabled={!dialedNumber}
        >
          <Ionicons name="call" size={32} color={colors.white} />
        </TouchableOpacity>
        {!dialedNumber && (
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="videocam" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
  },
  displayContainer: {
    paddingVertical: 20,
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
  dialPadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    gap: BUTTON_MARGIN,
  },
  dialButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BUTTON_SIZE / 2,
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
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 30,
  },
  optionButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  callButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  callButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default DialPad;
