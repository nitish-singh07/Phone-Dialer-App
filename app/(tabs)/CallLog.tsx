import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import Icon from "../../components/ui/Icon";

export default function CallLog() {
  const callHistory = useSelector((state) => state.history.callLogs);
  const [sortedCalls, setSortedCalls] = useState([]);

  useEffect(() => {
    // Sort calls by most recent first
    setSortedCalls([...callHistory].reverse());
  }, [callHistory]);

  const renderCallItem = ({ item }) => (
    <View style={styles.callItem}>
      <Icon
        name={item.type === "incoming" ? "phone-incoming" : "phone-outgoing"}
        size={20}
        color={Colors.primary}
      />
      <View style={styles.callDetails}>
        <Text style={styles.number}>{item.number}</Text>
        <Text style={styles.type}>
          {item.type} - {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Calls</Text>
      {callHistory.length === 0 ? (
        <Text style={styles.noCalls}>No recent calls</Text>
      ) : (
        <FlatList
          data={sortedCalls}
          renderItem={renderCallItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  noCalls: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  callDetails: {
    marginLeft: 10,
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  type: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
