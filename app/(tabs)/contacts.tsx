import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import { useContacts } from "../../hooks/useContacts";
import { useBlockedNumbers } from "../../hooks/useBlockedNumbers";
import { Contact } from "../../types";
import { SearchBar } from "../../components/contacts/SearchBar";
import { ContactModal } from "../../components/contacts/ContactModal";
import { Loading } from "../../components/common/Loading";
import { EmptyState } from "../../components/common/EmptyState";
import { useTheme } from "../../hooks/useTheme";
import { ContactList } from "../../components/contacts/ContactList";

export default function ContactsScreen() {
  const { contacts, loading, error } = useContacts();
  const { blockContact } = useBlockedNumbers();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  if (loading) return <Loading />;
  if (error) return <EmptyState icon="alert-circle" message={error} />;

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phoneNumbers?.some((phone) => phone.number.includes(searchQuery))
  );

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCall = async (phoneNumber: string) => {
    try {
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      Alert.alert("Error", "Could not initiate call");
    }
  };

  const handleBlock = async (contact: Contact) => {
    if (contact.phoneNumbers?.[0]) {
      await blockContact({
        id: contact.id,
        phoneNumber: contact.phoneNumbers[0].number,
        name: contact.name,
        dateBlocked: new Date().toISOString(),
      });
      Alert.alert("Success", `${contact.name} has been blocked`);
    }
    setSelectedContact(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search contacts..."
      />
      <ContactList
        contacts={filteredContacts}
        onContactPress={handleContactPress}
      />
      <ContactModal
        contact={selectedContact}
        visible={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onCall={handleCall}
        onBlock={handleBlock}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
