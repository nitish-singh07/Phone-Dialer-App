import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Icon } from "./Icon";

interface InputFieldProps extends TextInputProps {
  icon?: keyof typeof Icon.glyphMap;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  icon,
  error,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surfaceVariant },
          error && { borderColor: colors.error, borderWidth: 1 },
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary },
            icon && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  inputWithIcon: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
});
