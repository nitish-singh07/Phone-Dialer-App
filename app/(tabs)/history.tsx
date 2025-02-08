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
  CallLog,
  getCallHistory,
  deleteCallLog,
  clearCallHistory,
} from "../../utils/historyUtils";
import { isNumberBlocked } from "../../utils/blockingUtils";
import * as Linking from "expo-linking";

export default function HistoryScreen() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      const history = await getCallHistory();

      // Check if numbers are blocked
      const enrichedHistory = await Promise.all(
        history.map(async (log) => ({
          ...log,
          isBlocked: await isNumberBlocked(log.number),
        }))
      );

      setCallLogs(enrichedHistory);
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

  const handleDeleteLog = async (id: string) => {
    Alert.alert(
      "Delete Call Log",
      "Are you sure you want to delete this call log?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteCallLog(id);
            if (success) {
              loadCallHistory();
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all call history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            const success = await clearCallHistory();
            if (success) {
              loadCallHistory();
            }
          },
        },
      ]
    );
  };

  const renderCallIcon = (type: string, isBlocked: boolean) => {
    let iconName = "call-outline";
    let iconColor = colors.success;

    if (isBlocked) {
      iconColor = colors.error;
    } else if (type === "missed") {
      iconColor = colors.error;
    } else if (type === "incoming") {
      iconName = "call-received";
      iconColor = colors.success;
    } else if (type === "outgoing") {
      iconName = "call-made";
      iconColor = colors.primary;
    }

    return <Ionicons name={iconName} size={24} color={iconColor} />;
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
        <>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.error }]}
            onPress={handleClearHistory}
          >
            <Text style={[styles.clearButtonText, { color: colors.white }]}>
              Clear History
            </Text>
          </TouchableOpacity>

          <FlatList
            data={callLogs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.callItem, { backgroundColor: colors.surface }]}
                onLongPress={() => handleDeleteLog(item.id)}
                onPress={() => handleCall(item.number)}
              >
                <View style={styles.callIcon}>
                  {renderCallIcon(item.type, item.isBlocked)}
                </View>
                <View style={styles.callInfo}>
                  <Text
                    style={[styles.callName, { color: colors.textPrimary }]}
                  >
                    {item.contactName || item.number}
                  </Text>
                  {item.contactName && (
                    <Text
                      style={[
                        styles.callNumber,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.number}
                    </Text>
                  )}
                  <Text
                    style={[styles.callTime, { color: colors.textSecondary }]}
                  >
                    {new Date(item.time).toLocaleString()}
                  </Text>
                  {item.duration && (
                    <Text
                      style={[
                        styles.callDuration,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Duration: {item.duration}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={[styles.separator, { backgroundColor: colors.border }]}
              />
            )}
          />
        </>
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
  clearButton: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  callItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  callIcon: {
    width: 40,
    alignItems: "center",
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
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
