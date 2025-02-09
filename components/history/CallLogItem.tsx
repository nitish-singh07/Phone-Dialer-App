import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { CallLogEntry, formatCallDuration } from "../../utils/historyUtils";

interface CallLogItemProps {
  call: CallLogEntry;
  onCallPress: (number: string) => void;
}

export const CallLogItem: React.FC<CallLogItemProps> = ({
  call,
  onCallPress,
}) => {
  const { colors } = useTheme();

  const renderCallIcon = (type: string) => {
    switch (type) {
      case "missed":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={24} color={colors.error} />
            <Ionicons
              name="arrow-down"
              size={16}
              color={colors.error}
              style={styles.overlayIcon}
            />
          </View>
        );
      case "incoming":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={24} color={colors.success} />
            <Ionicons
              name="arrow-down"
              size={16}
              color={colors.success}
              style={styles.overlayIcon}
            />
          </View>
        );
      case "outgoing":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={24} color={colors.primary} />
            <Ionicons
              name="arrow-up"
              size={16}
              color={colors.primary}
              style={styles.overlayIcon}
            />
          </View>
        );
      default:
        return (
          <Ionicons name="call-outline" size={24} color={colors.textPrimary} />
        );
    }
  };

  return (
    <View style={[styles.callItem, { backgroundColor: colors.surface }]}>
      <View style={styles.callIcon}>{renderCallIcon(call.type)}</View>
      <View style={styles.callInfo}>
        <Text style={[styles.callName, { color: colors.textPrimary }]}>
          {call.name || call.phoneNumber}
        </Text>
        {call.name && (
          <Text style={[styles.callNumber, { color: colors.textSecondary }]}>
            {call.phoneNumber}
          </Text>
        )}
        <Text style={[styles.callTime, { color: colors.textSecondary }]}>
          {new Date(call.timestamp).toLocaleString()}
        </Text>
        <Text style={[styles.callDuration, { color: colors.textSecondary }]}>
          Duration: {formatCallDuration(call.duration)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.dialButton, { backgroundColor: colors.primary }]}
        onPress={() => onCallPress(call.phoneNumber)}
      >
        <Ionicons name="call" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  callItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayIcon: {
    position: "absolute",
    right: -4,
    bottom: -4,
  },
  callIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  callInfo: {
    flex: 1,
    marginLeft: 10,
  },
  callName: {
    fontSize: 16,
    fontWeight: "500",
  },
  callNumber: {
    fontSize: 14,
    marginTop: 2,
  },
  callTime: {
    fontSize: 12,
    marginTop: 2,
  },
  callDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  dialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
