import React from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";
import { RootState } from "../../store";
import { addDialedNumber, clearNumber } from "../../store/slices/dialerSlice";
import { addCallLog } from "../../store/slices/historySlice";
import { DialDisplay } from "../../components/dialpad/DialDisplay";
import { Keypad } from "../../components/dialpad/Keypad";
import { ActionButtons } from "../../components/dialpad/ActionButtons";
import { useTheme } from "../../hooks/useTheme";

function DialpadScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const dialedNumber = useSelector((state: RootState) => state.dialer.number);

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

  const handleCall = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.openURL(`tel:${dialedNumber}`);
      } else {
        await Linking.openURL(`telprompt:${dialedNumber}`);
      }

      dispatch(
        addCallLog({
          id: Date.now().toString(),
          phoneNumber: dialedNumber,
          type: "outgoing",
          timestamp: Date.now(),
          duration: 0,
        })
      );
      dispatch(clearNumber());
    } catch (error) {
      Alert.alert("Error", "Could not initiate call");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DialDisplay
        number={dialedNumber}
        onClear={handleClear}
        onLongClear={handleLongClear}
      />
      <Keypad onPress={handlePress} />
      <ActionButtons hasNumber={dialedNumber.length > 0} onCall={handleCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DialpadScreen;
