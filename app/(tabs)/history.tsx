import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "../../store";
import { getColors } from "../../constants/Colors";
import {
  CallLogEntry,
  getDeviceCallLogs,
  formatCallDuration,
} from "../../utils/historyUtils";
import * as Linking from "expo-linking";

export default function HistoryScreen() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      const logs = await getDeviceCallLogs();
      setCallLogs(logs);
    } catch (error) {
      console.error("Error loading call history:", error);
      Alert.alert("Error", "Failed to load call history");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCallHistory();
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadCallHistory();
  }, []);

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {callLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time" size={50} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No call history
          </Text>
        </View>
      ) : (
        <FlatList
          data={callLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[styles.callItem, { backgroundColor: colors.surface }]}
            >
              <View style={styles.callIcon}>{renderCallIcon(item.type)}</View>
              <View style={styles.callInfo}>
                <Text style={[styles.callName, { color: colors.textPrimary }]}>
                  {item.name || item.phoneNumber}
                </Text>
                {item.name && (
                  <Text
                    style={[styles.callNumber, { color: colors.textSecondary }]}
                  >
                    {item.phoneNumber}
                  </Text>
                )}
                <Text
                  style={[styles.callTime, { color: colors.textSecondary }]}
                >
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
                <Text
                  style={[styles.callDuration, { color: colors.textSecondary }]}
                >
                  Duration: {formatCallDuration(item.duration)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.dialButton, { backgroundColor: colors.primary }]}
                onPress={() => handleCall(item.phoneNumber)}
              >
                <Ionicons name="call" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
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
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
