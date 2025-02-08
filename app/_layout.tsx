import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { toggleTheme } from "../store/themeSlice";
import { getColors } from "../constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      store.dispatch(toggleTheme());
    }
  }, [colorScheme]);

  const isDarkMode = store.getState().theme.isDarkMode;
  const colors = getColors(isDarkMode);

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
