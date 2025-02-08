import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return { contacts, loading };
};
