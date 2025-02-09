import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import * as CallLog from "expo-call-log";
import { Platform } from "react-native";

interface PermissionsState {
  contacts: boolean;
  callLog: boolean;
  loading: boolean;
  error: string | null;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionsState>({
    contacts: false,
    callLog: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const [contactsPermission] = await Promise.all([
          Contacts.requestPermissionsAsync(),
          Platform.OS === "android" ? CallLog.requestPermissionsAsync() : null,
        ]);

        setPermissions({
          contacts: contactsPermission.status === "granted",
          callLog:
            Platform.OS === "android"
              ? contactsPermission.status === "granted"
              : false,
          loading: false,
          error: null,
        });
      } catch (error) {
        setPermissions((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to request permissions",
        }));
      }
    };

    requestPermissions();
  }, []);

  return permissions;
};
