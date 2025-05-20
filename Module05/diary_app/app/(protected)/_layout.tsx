import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/context/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BlurView } from "expo-blur";

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: () => (
            <AntDesign name="profile" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: () => (
            <MaterialIcons name="edit-calendar" size={30} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
