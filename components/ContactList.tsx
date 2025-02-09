import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Contact } from "../types";

interface ContactListProps {
  contacts: Contact[];
  onContactPress: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {contacts.map((contact) => (
        <TouchableOpacity
          key={contact.id}
          onPress={() => onContactPress(contact)}
          style={[styles.contactItem, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.white }]}>
              {contact.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: colors.textPrimary }]}>
              {contact.name}
            </Text>
            {contact.phoneNumbers && contact.phoneNumbers[0] && (
              <Text
                style={[styles.phoneNumber, { color: colors.textSecondary }]}
              >
                {contact.phoneNumbers[0].number}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
  },
  phoneNumber: {
    fontSize: 14,
    marginTop: 2,
  },
});
