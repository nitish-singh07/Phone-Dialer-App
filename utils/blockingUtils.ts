import { Platform } from "react-native";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BlockedNumberInfo {
  number: string;
  dateBlocked: string;
}

const BLOCKED_NUMBERS_KEY = "deviceBlockedNumbers";

export const checkBlockPermissions = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === "granted";
  } catch (err) {
    console.warn("Error checking permissions:", err);
    return false;
  }
};

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/\D/g, "");
};

export const getDeviceBlockedNumbers = async (): Promise<
  BlockedNumberInfo[]
> => {
  try {
    const blockedNumbers = await AsyncStorage.getItem(BLOCKED_NUMBERS_KEY);
    return blockedNumbers ? JSON.parse(blockedNumbers) : [];
  } catch (error) {
    console.error("Error getting blocked numbers:", error);
    return [];
  }
};

export const blockNumberOnDevice = async (
  phoneNumber: string | undefined
): Promise<boolean> => {
  try {
    if (!phoneNumber) {
      console.warn("No phone number provided to block");
      return false;
    }

    const formattedNumber = formatPhoneNumber(phoneNumber);
    if (!formattedNumber) {
      console.warn("Invalid phone number format");
      return false;
    }

    const currentBlocked = await getDeviceBlockedNumbers();
    if (!currentBlocked.some((item) => item.number === formattedNumber)) {
      const newBlockedNumber: BlockedNumberInfo = {
        number: formattedNumber,
        dateBlocked: new Date().toISOString(),
      };
      const updatedBlocked = [...currentBlocked, newBlockedNumber];
      await AsyncStorage.setItem(
        BLOCKED_NUMBERS_KEY,
        JSON.stringify(updatedBlocked)
      );
    }
    return true;
  } catch (error) {
    console.error("Error blocking number:", error);
    return false;
  }
};

export const unblockNumberFromDevice = async (
  phoneNumber: string | undefined
): Promise<boolean> => {
  try {
    if (!phoneNumber) {
      console.warn("No phone number provided to unblock");
      return false;
    }

    const formattedNumber = formatPhoneNumber(phoneNumber);
    const currentBlocked = await getDeviceBlockedNumbers();
    const updatedBlocked = currentBlocked.filter(
      (item) => item.number !== formattedNumber
    );
    await AsyncStorage.setItem(
      BLOCKED_NUMBERS_KEY,
      JSON.stringify(updatedBlocked)
    );
    return true;
  } catch (error) {
    console.error("Error unblocking number:", error);
    return false;
  }
};

export const isNumberBlocked = async (
  phoneNumber: string | undefined
): Promise<boolean> => {
  try {
    if (!phoneNumber) return false;

    const formattedNumber = formatPhoneNumber(phoneNumber);
    const blockedNumbers = await getDeviceBlockedNumbers();
    return blockedNumbers.some((item) => item.number === formattedNumber);
  } catch (error) {
    console.error("Error checking if number is blocked:", error);
    return false;
  }
};
