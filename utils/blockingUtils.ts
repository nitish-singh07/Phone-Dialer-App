import * as Contacts from "expo-contacts";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BlockedContact {
  id: string;
  name?: string;
  phoneNumber: string;
  dateBlocked: string;
}

const BLOCKED_CONTACTS_KEY = "blockedContacts";

export const getDeviceBlockedContacts = async (): Promise<BlockedContact[]> => {
  try {
    // Get contacts permission
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Contacts permission not granted");
      return [];
    }

    // Get all contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.ID,
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
      ],
    });

    // Get stored blocked numbers
    const storedBlocked = await AsyncStorage.getItem(BLOCKED_CONTACTS_KEY);
    const blockedNumbers: BlockedContact[] = storedBlocked
      ? JSON.parse(storedBlocked)
      : [];

    // Enrich blocked numbers with contact info
    const enrichedBlockedContacts = blockedNumbers.map((blocked) => {
      const contact = data.find((c) =>
        c.phoneNumbers?.some(
          (phone) =>
            formatPhoneNumber(phone.number) ===
            formatPhoneNumber(blocked.phoneNumber)
        )
      );

      return {
        ...blocked,
        name: contact?.name || blocked.name,
      };
    });

    return enrichedBlockedContacts;
  } catch (error) {
    console.error("Error getting blocked contacts:", error);
    return [];
  }
};

export const blockContact = async (
  phoneNumber: string,
  name?: string
): Promise<boolean> => {
  try {
    const blockedContacts = await getDeviceBlockedContacts();

    // Check if already blocked
    if (
      blockedContacts.some(
        (contact) =>
          formatPhoneNumber(contact.phoneNumber) ===
          formatPhoneNumber(phoneNumber)
      )
    ) {
      return false;
    }

    // Add to blocked contacts
    const newBlockedContact: BlockedContact = {
      id: Date.now().toString(),
      phoneNumber,
      name,
      dateBlocked: new Date().toISOString(),
    };

    const updatedBlockedContacts = [...blockedContacts, newBlockedContact];
    await AsyncStorage.setItem(
      BLOCKED_CONTACTS_KEY,
      JSON.stringify(updatedBlockedContacts)
    );

    return true;
  } catch (error) {
    console.error("Error blocking contact:", error);
    return false;
  }
};

export const unblockContact = async (phoneNumber: string): Promise<boolean> => {
  try {
    const blockedContacts = await getDeviceBlockedContacts();
    const updatedBlockedContacts = blockedContacts.filter(
      (contact) =>
        formatPhoneNumber(contact.phoneNumber) !==
        formatPhoneNumber(phoneNumber)
    );

    await AsyncStorage.setItem(
      BLOCKED_CONTACTS_KEY,
      JSON.stringify(updatedBlockedContacts)
    );

    return true;
  } catch (error) {
    console.error("Error unblocking contact:", error);
    return false;
  }
};

export const isNumberBlocked = async (
  phoneNumber: string
): Promise<boolean> => {
  try {
    const blockedContacts = await getDeviceBlockedContacts();
    return blockedContacts.some(
      (contact) =>
        formatPhoneNumber(contact.phoneNumber) ===
        formatPhoneNumber(phoneNumber)
    );
  } catch (error) {
    console.error("Error checking if number is blocked:", error);
    return false;
  }
};

export const formatPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/\D/g, "");
};

// Helper function to get contact name from phone number
export const getContactNameFromNumber = async (
  phoneNumber: string
): Promise<string | undefined> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return undefined;

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    const contact = data.find((c) =>
      c.phoneNumbers?.some(
        (phone) =>
          formatPhoneNumber(phone.number) === formatPhoneNumber(phoneNumber)
      )
    );

    return contact?.name;
  } catch (error) {
    console.error("Error getting contact name:", error);
    return undefined;
  }
};
