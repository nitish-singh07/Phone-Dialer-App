import React, { useState } from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { useBlockedNumbers } from "../../hooks/useBlockedNumbers";
import { BlockedList } from "../../components/blocked/BlockedList";
import { Loading } from "../../components/common/Loading";
import { EmptyState } from "../../components/common/EmptyState";
import { BlockedContact } from "../../types";
import { useTheme } from "../../hooks/useTheme";

export default function BlockedScreen() {
  const { blockedNumbers, loading, error, unblockContact } =
    useBlockedNumbers();
  const { colors } = useTheme();
  const [expandedContactId, setExpandedContactId] = useState<string | null>(
    null
  );

  if (loading) return <Loading />;
  if (error) return <EmptyState icon="alert-circle" message={error} />;

  const handleUnblock = (contact: BlockedContact) => {
    Alert.alert(
      "Unblock Contact",
      `Are you sure you want to unblock ${
        contact.name || contact.phoneNumber
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "destructive",
          onPress: () => {
            unblockContact(contact.phoneNumber);
            setExpandedContactId(null);
          },
        },
      ]
    );
  };

  const handleContactPress = (contact: BlockedContact) => {
    setExpandedContactId(expandedContactId === contact.id ? null : contact.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BlockedList
        blockedContacts={blockedNumbers}
        onUnblock={handleUnblock}
        onContactPress={handleContactPress}
        expandedContactId={expandedContactId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
