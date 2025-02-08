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
  getDeviceBlockedNumbers,
  unblockNumberFromDevice,
  formatPhoneNumber,
} from "../../utils/blockingUtils";

interface BlockedContact {
  id: string;
  name: string;
  number: string;
  dateBlocked: string;
  contactInfo?: Contact;
}

export default function BlockedScreen() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const [loading, setLoading] = useState(true);
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([]);

  const loadBlockedContacts = async () => {
    try {
      setLoading(true);
      const blockedNumbersInfo = await getDeviceBlockedNumbers();

      const enrichedContacts = await Promise.all(
        blockedNumbersInfo.map(async ({ number, dateBlocked }) => {
          if (!number) {
            console.warn("Found blocked entry without number");
            return null;
          }

          const contactInfo = await getContactByNumber(number);
          return {
            id: number,
            name: contactInfo?.name || "Unknown",
            number: number,
            dateBlocked,
            contactInfo,
          };
        })
      );

      const validContacts = enrichedContacts.filter(
        (contact): contact is BlockedContact => contact !== null
      );

      setBlockedContacts(validContacts);
    } catch (error) {
      console.error("Error loading blocked contacts:", error);
      Alert.alert("Error", "Failed to load blocked contacts");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadBlockedContacts();

      return () => {
        // Any cleanup if needed
      };
    }, [])
  );

  useEffect(() => {
    loadBlockedContacts();
  }, []);

  const handleUnblock = async (number: string) => {
    Alert.alert(
      "Unblock Number",
      "Are you sure you want to unblock this number?",
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
              const success = await unblockNumberFromDevice(number);
              if (success) {
                dispatch(unblockNumber(number));
                loadBlockedContacts();
                Alert.alert("Success", "Number has been unblocked");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to unblock number");
            }
          },
        },
      ]
    );
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
          <Ionicons
            name="shield-checkmark"
            size={50}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No blocked numbers
          </Text>
        </View>
      ) : (
        <FlatList
          data={blockedContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[styles.blockedItem, { backgroundColor: colors.surface }]}
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
                <Text
                  style={[styles.phoneNumber, { color: colors.textSecondary }]}
                >
                  {item.number}
                </Text>
                <Text
                  style={[styles.dateBlocked, { color: colors.textSecondary }]}
                >
                  Blocked on {new Date(item.dateBlocked).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.unblockButton,
                  { backgroundColor: colors.error },
                ]}
                onPress={() => handleUnblock(item.number)}
              >
                <Ionicons name="lock-open" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
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
});
