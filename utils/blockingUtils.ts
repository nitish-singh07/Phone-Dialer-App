import * as Contacts from "expo-contacts";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlockedContact } from "../types";
import { getContactByNumber } from "./contactsUtils";

export interface BlockedContact {
  id: string;
  name?: string;
  phoneNumber: string;
  dateBlocked: string;
}

const BLOCKED_CONTACTS_KEY = "blockedContacts";

export const getDeviceBlockedContacts = async (): Promise<BlockedContact[]> => {
  try {
    const blockedData = await AsyncStorage.getItem("blockedNumbers");
    return blockedData ? JSON.parse(blockedData) : [];
  } catch (error) {
    console.error("Error fetching blocked contacts:", error);
    return [];
  }
};

export const blockContact = async (
  phoneNumber: string
): Promise<BlockedContact> => {
  const contact = await getContactByNumber(phoneNumber);
  const blockedContact: BlockedContact = {
    id: Date.now().toString(),
    phoneNumber,
    name: contact?.name,
    dateBlocked: new Date().toISOString(),
  };

  const blockedContacts = await getDeviceBlockedContacts();
  await AsyncStorage.setItem(
    "blockedNumbers",
    JSON.stringify([...blockedContacts, blockedContact])
  );

  return blockedContact;
};

export const unblockContact = async (phoneNumber: string): Promise<void> => {
  const blockedContacts = await getDeviceBlockedContacts();
  const updatedContacts = blockedContacts.filter(
    (contact) => contact.phoneNumber !== phoneNumber
  );
  await AsyncStorage.setItem("blockedNumbers", JSON.stringify(updatedContacts));
};

export const isNumberBlocked = async (
  phoneNumber: string
): Promise<boolean> => {
  const blockedContacts = await getDeviceBlockedContacts();
  return blockedContacts.some((contact) => contact.phoneNumber === phoneNumber);
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
