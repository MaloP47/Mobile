import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
