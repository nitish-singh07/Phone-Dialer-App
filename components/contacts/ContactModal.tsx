import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Contact } from "../../types";

interface ContactModalProps {
  contact: Contact | null;
  visible: boolean;
  onClose: () => void;
  onCall: (phoneNumber: string) => void;
  onBlock: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  isBlocked: boolean;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  contact,
  visible,
  onClose,
  onCall,
  onBlock,
  onDelete,
  isBlocked,
}) => {
  const { colors } = useTheme();

  if (!contact) return null;

  const phoneNumber = contact.phoneNumbers?.[0]?.number;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            {contact.name}
          </Text>
          {phoneNumber && (
            <Text style={[styles.modalPhone, { color: colors.textSecondary }]}>
              {phoneNumber}
            </Text>
          )}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => phoneNumber && onCall(phoneNumber)}
            >
              <Ionicons name="call" size={20} color={colors.white} />
              <Text style={[styles.actionText, { color: colors.white }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={() => onBlock(contact)}
            >
              <Ionicons
                name={isBlocked ? "ban-outline" : "ban"}
                size={20}
                color={colors.white}
              />
              <Text style={[styles.actionText, { color: colors.white }]}>
                {isBlocked ? "Unblock" : "Block"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={() => onDelete(contact)}
            >
              <Ionicons name="trash" size={20} color={colors.white} />
              <Text style={[styles.actionText, { color: colors.white }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalPhone: {
    fontSize: 16,
    marginBottom: 24,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,

    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
