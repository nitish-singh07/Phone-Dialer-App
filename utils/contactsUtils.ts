import * as Contacts from "expo-contacts";
import { Contact } from "../types";

export interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    id: string;
    number: string;
    label: string;
  }>;
  imageAvailable?: boolean;
  image?: {
    uri: string;
  };
}

export const getDeviceContacts = async (): Promise<Contact[]> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission to access contacts was denied");
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.ID,
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
      ],
    });

    return data.map((contact) => ({
      id: contact.id,
      name: contact.name || "Unknown",
      phoneNumbers: contact.phoneNumbers?.map((phone) => ({
        id: phone.id || "",
        number: phone.number,
        label: phone.label,
      })),
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const searchContacts = async (query: string): Promise<Contact[]> => {
  const contacts = await getDeviceContacts();
  const searchQuery = query.toLowerCase();

  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery) ||
      contact.phoneNumbers?.some((phone) => phone.number.includes(searchQuery))
  );
};

export const getContactByNumber = async (
  phoneNumber: string
): Promise<Contact | null> => {
  const contacts = await getDeviceContacts();
  return (
    contacts.find((contact) =>
      contact.phoneNumbers?.some(
        (phone) =>
          phone.number.replace(/\D/g, "") === phoneNumber.replace(/\D/g, "")
      )
    ) || null
  );
};

export const formatContactDisplay = (contact: Contact | null): string => {
  if (!contact) return "";
  const mainNumber = contact.phoneNumbers?.[0]?.number || "";
  return `${contact.name} (${mainNumber})`;
};
