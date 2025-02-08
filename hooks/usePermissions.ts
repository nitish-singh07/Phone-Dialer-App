import { useEffect, useState } from "react";
import * as Permissions from "expo-permissions";

export const usePermissions = () => {
  const [callPermission, setCallPermission] = useState<boolean | null>(null);
  const [contactsPermission, setContactsPermission] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: callStatus } = await Permissions.askAsync(
        Permissions.CALL_PHONE
      );
      setCallPermission(callStatus === "granted");

      const { status: contactsStatus } = await Permissions.askAsync(
        Permissions.CONTACTS
      );
      setContactsPermission(contactsStatus === "granted");
    };

    requestPermissions();
  }, []);

  return { callPermission, contactsPermission };
};
