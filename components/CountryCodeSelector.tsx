import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getColors } from "../constants/Colors";

interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

interface Props {
  onSelect: (code: string) => void;
  selectedCode: string;
}

const countryCodes: CountryCode[] = [
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  // Add more country codes as needed
];

export default function CountryCodeSelector({ onSelect, selectedCode }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  const filteredCodes = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery)
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorText, { color: colors.textPrimary }]}>
          {selectedCode}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Search country or code..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCodes}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  onSelect(item.dial_code);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[styles.countryName, { color: colors.textPrimary }]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.dialCode, { color: colors.textSecondary }]}
                >
                  {item.dial_code}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  selectorText: {
    fontSize: 16,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
  },
  countryName: {
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
  },
  closeButton: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
