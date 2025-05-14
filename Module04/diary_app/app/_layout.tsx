import "react-native-url-polyfill/auto";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
    MsMadi: require("../assets/fonts/MsMadi-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("@/assets/images/golden.png")}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="loginProvider"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </ImageBackground>
  );
}
