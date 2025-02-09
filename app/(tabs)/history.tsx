import React, { useState } from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Loading } from "../../components/common/Loading";
import { EmptyState } from "../../components/common/EmptyState";
import { useTheme } from "../../hooks/useTheme";
import { CallLogList } from "../../components/history/CallLogList";
import { getDeviceCallLogs } from "../../utils/historyUtils";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState([]);
  const { colors } = useTheme();

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

  useFocusEffect(
    React.useCallback(() => {
      loadCallHistory();
    }, [])
  );

  const handleCall = async (phoneNumber: string) => {
    try {
      if (Platform.OS === "android") {
        await Linking.openURL(`tel:${phoneNumber}`);
      } else {
        await Linking.openURL(`telprompt:${phoneNumber}`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not initiate call");
    }
  };

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CallLogList logs={callLogs} onCallPress={handleCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
