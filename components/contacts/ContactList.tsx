import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Contact } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import { EmptyState } from "../common/EmptyState";
import { ContactItem } from "./ContactItem";

interface ContactListProps {
  contacts: Contact[];
  onContactPress: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactPress,
}) => {
  const { colors } = useTheme();

  if (contacts.length === 0) {
    return <EmptyState icon="people" message="No contacts found" />;
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactItem contact={item} onPress={() => onContactPress(item)} />
      )}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 65,
  },
});
