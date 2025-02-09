import * as Contacts from "expo-contacts";
import * as CallLog from "expo-call-log";
import { Platform } from "react-native";

export const checkPermissions = async () => {
  try {
    const permissions = {
      contacts: false,
      callLog: false,
    };

    const { status: contactsStatus } = await Contacts.getPermissionsAsync();
    permissions.contacts = contactsStatus === "granted";

    if (Platform.OS === "android") {
      const { status: callLogStatus } = await CallLog.getPermissionsAsync();
      permissions.callLog = callLogStatus === "granted";
    }

    return permissions;
  } catch (error) {
    console.error("Error checking permissions:", error);
    throw error;
  }
};

export const requestPermissions = async () => {
  try {
    const permissions = {
      contacts: false,
      callLog: false,
    };

    const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
    permissions.contacts = contactsStatus === "granted";

    if (Platform.OS === "android") {
      const { status: callLogStatus } = await CallLog.requestPermissionsAsync();
      permissions.callLog = callLogStatus === "granted";
    }

    return permissions;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    throw error;
  }
};
