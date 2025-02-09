import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { InputField } from "./ui/InputField";
import { Button } from "./ui/Button";

interface SaveContactFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: { name: string; phoneNumber: string }) => void;
  initialPhoneNumber?: string;
}

export const SaveContactForm: React.FC<SaveContactFormProps> = ({
  visible,
  onClose,
  onSave,
  initialPhoneNumber = "",
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const handleSave = () => {
    if (name.trim() && phoneNumber.trim()) {
      onSave({ name: name.trim(), phoneNumber: phoneNumber.trim() });
      setName("");
      setPhoneNumber("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.overlay }]}
      >
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            New Contact
          </Text>
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoFocus
          />
          <InputField
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} variant="secondary" />
            <Button
              title="Save"
              onPress={handleSave}
              disabled={!name.trim() || !phoneNumber.trim()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
});
