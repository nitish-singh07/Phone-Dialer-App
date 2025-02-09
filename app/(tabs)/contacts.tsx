import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getColors } from "../../constants/Colors";
import {
  Contact,
  getDeviceContacts,
  searchContacts,
} from "../../utils/contactsUtils";
import { blockContact, isNumberBlocked } from "../../utils/blockingUtils";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const deviceContacts = await getDeviceContacts();
      setContacts(deviceContacts);
      setFilteredContacts(deviceContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const results = await searchContacts(text);
      setFilteredContacts(results);
    }
  };

  const handleBlock = async (contact: Contact) => {
    const phoneNumber = contact.phoneNumbers?.[0]?.number;
    if (!phoneNumber) {
      Alert.alert("Error", "No phone number available for this contact");
      return;
    }

    Alert.alert(
      "Block Contact",
      `Are you sure you want to block ${contact.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              const isBlocked = await isNumberBlocked(phoneNumber);
              if (isBlocked) {
                Alert.alert("Info", "This contact is already blocked");
                return;
              }

              const success = await blockContact(phoneNumber, contact.name);
              if (success) {
                Alert.alert("Success", `${contact.name} has been blocked`);
              } else {
                Alert.alert("Error", "Failed to block contact");
              }
            } catch (error) {
              console.error("Error blocking contact:", error);
              Alert.alert("Error", "Failed to block contact");
            }
          },
        },
      ]
    );
  };

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalVisible(true);
  };

  const handleCall = () => {
    if (selectedContact?.phoneNumbers?.[0]?.number) {
      // Handle call action
      setIsModalVisible(false);
    }
  };

  const handleScroll = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
    }
  };

  const handleDelete = async () => {
    if (selectedContact) {
      Alert.alert(
        "Delete Contact",
        `Are you sure you want to delete ${selectedContact.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Add your delete contact logic here
                setIsModalVisible(false);
                Alert.alert("Success", "Contact deleted successfully");
              } catch (error) {
                console.error("Error deleting contact:", error);
                Alert.alert("Error", "Failed to delete contact");
              }
            },
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadContacts}
        >
          <Text style={[styles.retryText, { color: colors.white }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.border,
            },
          ]}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleContactPress(item)}>
            <View
              style={[styles.contactItem, { backgroundColor: colors.surface }]}
            >
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.avatarText, { color: colors.white }]}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text
                  style={[styles.contactName, { color: colors.textPrimary }]}
                >
                  {item.name}
                </Text>
                {item.phoneNumbers && item.phoneNumbers[0] && (
                  <Text
                    style={[
                      styles.phoneNumber,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.phoneNumbers[0].number}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {selectedContact?.name}
            </Text>
            <Text style={[styles.modalPhone, { color: colors.textSecondary }]}>
              {selectedContact?.phoneNumbers?.[0]?.number}
            </Text>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={24} color={colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>
                  Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={() => {
                  setIsModalVisible(false);
                  if (selectedContact) handleBlock(selectedContact);
                }}
              >
                <Ionicons name="ban" size={24} color={colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>
                  Block
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={24} color={colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  contactItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
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
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 65,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalPhone: {
    fontSize: 16,
    marginBottom: 24,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
