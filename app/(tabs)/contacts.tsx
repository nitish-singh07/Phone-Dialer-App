import { View, FlatList, Text, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function getContacts() {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();
        setContacts(data);
      }
    }
    getContacts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.text}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 18, marginBottom: 10 },
});

export default ContactsScreen;
