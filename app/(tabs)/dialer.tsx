import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDialedNumber } from "../../store/dialerSlice";
import * as Linking from "expo-linking";

const Dialer = () => {
  const dispatch = useDispatch();
  const dialedNumber = useSelector((state) => state.dialer.number);

  const makeCall = () => {
    if (dialedNumber) {
      Linking.openURL(`tel:${dialedNumber}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={dialedNumber}
        placeholder="Enter number"
        keyboardType="phone-pad"
        onChangeText={(text) => dispatch(addDialedNumber(text))}
      />
      <TouchableOpacity style={styles.button} onPress={makeCall}>
        <Text style={styles.buttonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default Dialer;
