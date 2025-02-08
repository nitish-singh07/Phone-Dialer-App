import AsyncStorage from "@react-native-async-storage/async-storage";
import { getContactByNumber } from "./contactsUtils";

export interface CallLog {
  id: string;
  number: string;
  type: "incoming" | "outgoing" | "missed";
  time: string;
  duration?: string;
  contactName?: string;
}

const CALL_HISTORY_KEY = "deviceCallHistory";

export const saveCallToHistory = async (
  call: Omit<CallLog, "id" | "contactName">
) => {
  try {
    const contact = await getContactByNumber(call.number);
    const newCall: CallLog = {
      id: Date.now().toString(),
      ...call,
      contactName: contact?.name,
    };

    const history = await getCallHistory();
    const updatedHistory = [newCall, ...history];

    await AsyncStorage.setItem(
      CALL_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
    return true;
  } catch (error) {
    console.error("Error saving call to history:", error);
    return false;
  }
};

export const getCallHistory = async (): Promise<CallLog[]> => {
  try {
    const history = await AsyncStorage.getItem(CALL_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting call history:", error);
    return [];
  }
};

export const clearCallHistory = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(CALL_HISTORY_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error("Error clearing call history:", error);
    return false;
  }
};

export const deleteCallLog = async (id: string): Promise<boolean> => {
  try {
    const history = await getCallHistory();
    const updatedHistory = history.filter((call) => call.id !== id);
    await AsyncStorage.setItem(
      CALL_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
    return true;
  } catch (error) {
    console.error("Error deleting call log:", error);
    return false;
  }
};

export const formatCallDuration = (seconds: number): string => {
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
