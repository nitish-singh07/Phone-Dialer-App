import { View, FlatList, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

const CallHistory = () => {
  const [history, setHistory] = useState([
    { id: "1", number: "+123456789", type: "Outgoing" },
    { id: "2", number: "+987654321", type: "Incoming" },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.type}: {item.number}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 18, marginBottom: 10 },
});

export default CallHistory;
