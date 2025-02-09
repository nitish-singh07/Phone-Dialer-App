import React from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import { CallLogItem } from "../CallLog";
import { EmptyState } from "../common/EmptyState";
import { CallLogEntry } from "../../types";
import { useTheme } from "../../hooks/useTheme";

interface CallLogListProps {
  logs: CallLogEntry[];
  onCallPress: (number: string) => void;
  refreshControl?: React.ReactElement;
}

export const CallLogList: React.FC<CallLogListProps> = ({
  logs,
  onCallPress,
  refreshControl,
}) => {
  const { colors } = useTheme();

  if (logs.length === 0) {
    return <EmptyState icon="time" message="No call history" />;
  }

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CallLogItem call={item} onCallPress={onCallPress} />
      )}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
      refreshControl={refreshControl}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 65,
  },
});
