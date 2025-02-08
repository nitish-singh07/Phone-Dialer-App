// import { Tabs } from "expo-router";
import { Provider } from "react-redux";
import store from "../store";
import TabsLayout from "./(tabs)/_layout";

export default function Layout() {
  return (
    <Provider store={store}>
      <TabsLayout />
    </Provider>
  );
}
