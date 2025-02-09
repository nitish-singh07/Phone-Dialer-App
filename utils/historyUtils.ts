import * as Contacts from "expo-contacts";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getContactByNumber } from "./contactsUtils";

export interface CallLogEntry {
  id: string;
  phoneNumber: string;
  name?: string;
  timestamp: number;
  duration: number;
  type: "incoming" | "outgoing" | "missed";
}

export const getDeviceCallLogs = async (): Promise<CallLogEntry[]> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Contacts permission not granted");
      return [];
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Name,
        Contacts.Fields.ID,
      ],
    });

    const callLogs: CallLogEntry[] = data
      .filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      )
      .flatMap((contact) =>
        contact.phoneNumbers!.map((phone, index) => ({
          id: `${contact.id}-${index}`,
          phoneNumber: phone.number || "Unknown",
          name: contact.name,
          timestamp: Date.now() - index * 86400000,
          duration: Math.floor(Math.random() * 300),
          type: simulateCallType(),
        }))
      );

    return callLogs.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

export const addCallToHistory = async (
  phoneNumber: string,
  type: "incoming" | "outgoing" | "missed",
  duration: number = 0
): Promise<CallLogEntry> => {
  const contact = await getContactByNumber(phoneNumber);
  const newCall: CallLogEntry = {
    id: Date.now().toString(),
    phoneNumber,
    name: contact?.name,
    type,
    timestamp: Date.now(),
    duration,
  };

  const callLogs = await getDeviceCallLogs();
  await AsyncStorage.setItem(
    "callLogs",
    JSON.stringify([newCall, ...callLogs])
  );

  return newCall;
};

// Helper function to simulate call types
const simulateCallType = (): "incoming" | "outgoing" | "missed" => {
  const types: ("incoming" | "outgoing" | "missed")[] = [
    "incoming",
    "outgoing",
    "missed",
  ];
  return types[Math.floor(Math.random() * types.length)];
};

export const formatCallDuration = (seconds: number): string => {
  if (!seconds) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};
