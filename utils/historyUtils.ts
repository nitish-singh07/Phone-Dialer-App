import * as Contacts from "expo-contacts";
import { Platform } from "react-native";

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
    // Request contacts permission which includes recent calls
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Contacts permission not granted");
      return [];
    }

    // Get contacts with phone numbers
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Name,
        Contacts.Fields.ID,
      ],
    });

    // Filter contacts with phone numbers and create call log entries
    const callLogs: CallLogEntry[] = data
      .filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      )
      .flatMap((contact) =>
        contact.phoneNumbers!.map((phone, index) => ({
          id: `${contact.id}-${index}`,
          phoneNumber: phone.number || "Unknown",
          name: contact.name,
          timestamp: Date.now() - index * 86400000, // Simulate different dates
          duration: Math.floor(Math.random() * 300), // Simulate random duration
          type: simulateCallType(), // Simulate call types
        }))
      );

    // Sort by timestamp (most recent first)
    return callLogs.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
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
