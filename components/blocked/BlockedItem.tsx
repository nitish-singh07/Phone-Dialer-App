import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { BlockedContact } from "../../types";

interface BlockedItemProps {
  contact: BlockedContact;
  onUnblock: (contact: BlockedContact) => void;
  onPress: (contact: BlockedContact) => void;
  isExpanded: boolean;
}

export const BlockedItem: React.FC<BlockedItemProps> = ({
  contact,
  onUnblock,
  onPress,
  isExpanded,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={() => onPress(contact)}>
      <View style={[styles.blockedItem, { backgroundColor: colors.surface }]}>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: colors.textPrimary }]}>
            {contact.name || "Unknown"}
          </Text>
          <Text style={[styles.phoneNumber, { color: colors.textSecondary }]}>
            {contact.phoneNumber}
          </Text>
          {isExpanded && (
            <View style={styles.expandedInfo}>
              <Text
                style={[styles.dateBlocked, { color: colors.textSecondary }]}
              >
                Blocked on {new Date(contact.dateBlocked).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.unblockButton, { backgroundColor: colors.error }]}
          onPress={() => onUnblock(contact)}
        >
          <Ionicons name="ban-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blockedItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
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
  dateBlocked: {
    fontSize: 12,
    marginTop: 4,
  },
  unblockButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  expandedInfo: {
    marginTop: 8,
  },
});
