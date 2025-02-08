import { View, FlatList, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const CallLog = () => {
  const history = useSelector((state) => state.history.calls);

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

export default CallLog;
