import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDialedNumber, clearNumber } from "../../store/dialerSlice";
import * as Linking from "expo-linking";

const DialPad = () => {
  const dispatch = useDispatch();
  const dialedNumber = useSelector((state) => state.dialer.number);

  const handlePress = (digit: string) => {
    dispatch(addDialedNumber(dialedNumber + digit));
  };

  const handleCall = () => {
    if (dialedNumber) {
      Linking.openURL(`tel:${dialedNumber}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{dialedNumber}</Text>
      <View style={styles.dialPad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
          (digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.button}
              onPress={() => handlePress(digit)}
            >
              <Text style={styles.buttonText}>{digit}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Text style={styles.callButtonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  number: { fontSize: 24, marginBottom: 20 },
  dialPad: { flexDirection: "row", flexWrap: "wrap", width: 200 },
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#ddd",
    borderRadius: 30,
  },
  buttonText: { fontSize: 20, fontWeight: "bold" },
  callButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  callButtonText: { color: "white", fontWeight: "bold" },
});

export default DialPad;
