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
import {
  blockNumberOnDevice,
  isNumberBlocked,
} from "../../utils/blockingUtils";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const results = await searchContacts(text);
      setFilteredContacts(results);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const handleContactPress = async (contact: Contact) => {
    if (!contact.phoneNumbers?.[0]) return;

    const number = contact.phoneNumbers[0].number;
    const isBlocked = await isNumberBlocked(number);

    Alert.alert(
      contact.name,
      `${number}\n${
        isBlocked ? "Unblock this contact?" : "What would you like to do?"
      }`,
      isBlocked
        ? [
            { text: "Cancel", style: "cancel" },
            {
              text: "Unblock",
              style: "destructive",
              onPress: () => handleUnblock(number),
            },
          ]
        : [
            { text: "Cancel", style: "cancel" },
            { text: "Call", onPress: () => handleCall(number) },
            {
              text: "Block",
              style: "destructive",
              onPress: () => handleBlock(number),
            },
          ]
    );
  };

  const handleCall = (number: string) => {
    // Implementation from your dialpad component
  };

  const handleBlock = async (number: string) => {
    try {
      const success = await blockNumberOnDevice(number);
      if (success) {
        Alert.alert("Success", "Contact has been blocked");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to block contact");
    }
  };

  const handleUnblock = async (number: string) => {
    try {
      const success = await unblockNumberFromDevice(number);
      if (success) {
        Alert.alert("Success", "Contact has been unblocked");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to unblock contact");
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
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.contactItem, { backgroundColor: colors.surface }]}
            onPress={() => handleContactPress(item)}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.white }]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                {item.name}
              </Text>
              {item.phoneNumbers?.[0] && (
                <Text
                  style={[styles.phoneNumber, { color: colors.textSecondary }]}
                >
                  {item.phoneNumbers[0].number}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
      />
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
});
