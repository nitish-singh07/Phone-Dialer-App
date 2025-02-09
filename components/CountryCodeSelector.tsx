import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { SearchBar } from "./contacts/SearchBar";

interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

interface CountryCodeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (countryCode: CountryCode) => void;
  selectedCode?: string;
}

export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCode,
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [countryCodes, setCountryCodes] = React.useState<CountryCode[]>([
    { name: "United States", dial_code: "+1", code: "US" },
    { name: "India", dial_code: "+91", code: "IN" },
    { name: "United Kingdom", dial_code: "+44", code: "GB" },
    // Add more country codes as needed
  ]);

  const filteredCodes = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery)
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search country..."
          />
          <FlatList
            data={filteredCodes}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  selectedCode === item.code && {
                    backgroundColor: colors.surfaceVariant,
                  },
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  countryName: {
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
  },
});
