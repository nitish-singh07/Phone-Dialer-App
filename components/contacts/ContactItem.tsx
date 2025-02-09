import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Contact } from "../../types";
import { useTheme } from "../../hooks/useTheme";

interface ContactItemProps {
  contact: Contact;
  onPress: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name="person" size={24} color={colors.textSecondary} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {contact.name}
        </Text>
        {contact.phoneNumbers && contact.phoneNumbers[0] && (
          <Text style={[styles.phone, { color: colors.textSecondary }]}>
            {contact.phoneNumbers[0].number}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  phone: {
    fontSize: 14,
    marginTop: 2,
  },
});
