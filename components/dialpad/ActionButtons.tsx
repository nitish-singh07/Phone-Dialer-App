import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

interface ActionButtonsProps {
  hasNumber: boolean;
  onCall: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasNumber,
  onCall,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.bottomContainer}>
      {!hasNumber && (
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.callButton,
          !hasNumber && styles.callButtonDisabled,
          { backgroundColor: hasNumber ? colors.primary : colors.border },
        ]}
        onPress={onCall}
        disabled={!hasNumber}
      >
        <Ionicons name="call" size={32} color={colors.white} />
      </TouchableOpacity>
      {!hasNumber && (
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="videocam" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
