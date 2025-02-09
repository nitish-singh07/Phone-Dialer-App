import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "../../store";
import { getColors } from "../../constants/Colors";
import {
  blockNumber,
  unblockNumber,
  setBlockedNumbers,
} from "../../store/blockingSlice";
import { Contact, getContactByNumber } from "../../utils/contactsUtils";
import {
  getDeviceBlockedContacts,
  unblockContact,
  formatPhoneNumber,
} from "../../utils/blockingUtils";

interface BlockedContact {
  phoneNumber: string;
  id: string;
  name: string;
  dateBlocked: string;
  contactInfo?: Contact;
}

export default function BlockedScreen() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const [loading, setLoading] = useState(true);
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([]);
  const [expandedContactId, setExpandedContactId] = useState<string | null>(
    null
  );

  const loadBlockedContacts = async () => {
    try {
      setLoading(true);
      const contacts = await getDeviceBlockedContacts();
      setBlockedContacts(contacts);
    } catch (error) {
      console.error("Error loading blocked contacts:", error);
      Alert.alert("Error", "Failed to load blocked contacts");
    } finally {
      setLoading(false);
    }
  };

  // Refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBlockedContacts();
    }, [])
  );

  const handleUnblock = async (contact: BlockedContact) => {
    Alert.alert(
      "Unblock Contact",
      `Are you sure you want to unblock ${
        contact.name || contact.phoneNumber
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unblock",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await unblockContact(contact.phoneNumber);
              if (success) {
                // Reload the list after successful unblock
                await loadBlockedContacts();
                Alert.alert("Success", "Contact has been unblocked");
              } else {
                Alert.alert("Error", "Failed to unblock contact");
              }
            } catch (error) {
              console.error("Error unblocking contact:", error);
              Alert.alert("Error", "Failed to unblock contact");
            }
          },
        },
      ]
    );
  };

  const handleScroll = () => {
    // Hide expanded contact on any scroll
    if (expandedContactId) {
      setExpandedContactId(null);
    }
  };

  const toggleExpand = (contactId: string) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {blockedContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ban" size={50} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No blocked contacts
          </Text>
        </View>
      ) : (
        <FlatList
          data={blockedContacts}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <View
                style={[
                  styles.blockedItem,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.contactInfo}>
                  <Text
                    style={[styles.contactName, { color: colors.textPrimary }]}
                  >
                    {item.name || "Unknown"}
                  </Text>
                  <Text
                    style={[
                      styles.phoneNumber,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.phoneNumber}
                  </Text>
                  {expandedContactId === item.id && (
                    <View style={styles.expandedInfo}>
                      <Text
                        style={[
                          styles.dateBlocked,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Blocked on{" "}
                        {new Date(item.dateBlocked).toLocaleDateString()}
                      </Text>
                      {/* Add any additional expanded contact information here */}
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.unblockButton,
                    { backgroundColor: colors.error },
                  ]}
                  onPress={() => handleUnblock(item)}
                >
                  <Ionicons name="ban-outline" size={24} color={colors.white} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
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
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  expandedInfo: {
    marginTop: 8,
  },
});
