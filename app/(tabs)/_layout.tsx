import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getColors } from "../../constants/Colors";
import { View } from "react-native";
import ThemeToggle from "../../components/ThemeToggle";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            color: colors.textPrimary,
          },
          headerRight: () => <ThemeToggle />,
          tabBarLabelStyle: {
            color: colors.textPrimary,
          },
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="DialPad"
          options={{
            title: "Dialpaded",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "keypad" : "keypad-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="blocked"
          options={{
            title: "Blocked",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "shield" : "shield-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
