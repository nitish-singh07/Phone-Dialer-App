import * as Contacts from "expo-contacts";

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
        Contacts.Fields.Image,
        Contacts.Fields.ImageAvailable,
      ],
    });

    if (data.length > 0) {
      // Filter out contacts without phone numbers and format the data
      return data
        .filter(
          (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
        )
        .map((contact) => ({
          id: contact.id,
          name: contact.name || "Unknown",
          phoneNumbers: contact.phoneNumbers?.map((phone) => ({
            id: phone.id || "",
            number: phone.number || "",
            label: phone.label || "",
          })),
          imageAvailable: contact.imageAvailable,
          image: contact.image,
        }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const searchContacts = async (query: string): Promise<Contact[]> => {
  try {
    const contacts = await getDeviceContacts();
    const searchQuery = query.toLowerCase();

    return contacts.filter((contact) => {
      const matchName = contact.name.toLowerCase().includes(searchQuery);
      const matchNumber = contact.phoneNumbers?.some(
        (phone) => phone.number && phone.number.includes(searchQuery)
      );
      return matchName || matchNumber;
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    throw error;
  }
};

export const getContactByNumber = async (
  phoneNumber: string
): Promise<Contact | null> => {
  try {
    if (!phoneNumber) {
      console.warn("No phone number provided to getContactByNumber");
      return null;
    }

    const contacts = await getDeviceContacts();
    const normalizedSearchNumber = phoneNumber.replace(/\D/g, "");

    return (
      contacts.find((contact) =>
        contact.phoneNumbers?.some((phone) => {
          if (!phone || !phone.number) return false;
          const normalizedContactNumber = phone.number.replace(/\D/g, "");
          return normalizedContactNumber === normalizedSearchNumber;
        })
      ) || null
    );
  } catch (error) {
    console.error("Error finding contact:", error);
    return null;
  }
};

export const formatContactDisplay = (contact: Contact | null): string => {
  if (!contact) return "";
  const mainNumber = contact.phoneNumbers?.[0]?.number || "";
  return `${contact.name} (${mainNumber})`;
};
