import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { setTheme } from "../store/slices/themeSlice";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    store.dispatch(setTheme(colorScheme === "dark"));
  }, [colorScheme]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Provider>
    </ErrorBoundary>
  );
}
