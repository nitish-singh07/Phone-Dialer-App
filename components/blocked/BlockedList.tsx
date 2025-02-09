import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { BlockedItem } from "./BlockedItem";
import { EmptyState } from "../common/EmptyState";
import { BlockedContact } from "../../types";
import { useTheme } from "../../hooks/useTheme";

interface BlockedListProps {
  blockedContacts: BlockedContact[];
  onUnblock: (contact: BlockedContact) => void;
  onContactPress: (contact: BlockedContact) => void;
  expandedContactId: string | null;
}

export const BlockedList: React.FC<BlockedListProps> = ({
  blockedContacts,
  onUnblock,
  onContactPress,
  expandedContactId,
}) => {
  const { colors } = useTheme();

  if (blockedContacts.length === 0) {
    return <EmptyState icon="shield" message="No blocked contacts" />;
  }

  return (
    <FlatList
      data={blockedContacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BlockedItem
          contact={item}
          onUnblock={onUnblock}
          onPress={onContactPress}
          isExpanded={expandedContactId === item.id}
        />
      )}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
