import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  userID: string;
  logIn: (userID: string) => void;
  logOut: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  userID: "",
  logIn: (userID: string) => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState<string>("");
  const router = useRouter();

  const storeAuthState = async (newState: {
    isLoggedIn: boolean;
    userID: string;
  }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving", error);
    }
  };

  const logIn = (userID: string) => {
    console.log("Logging in with userID:", userID); // Debug log
    setIsLoggedIn(true);
    setUserID(userID);
    storeAuthState({ isLoggedIn: true, userID });
    router.replace("/(protected)/profile");
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }
    setIsLoggedIn(false);
    setUserID("");
    storeAuthState({ isLoggedIn: false, userID: "" });
    router.replace("/");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
          setUserID(auth.userID || "");

          console.log("Retrieved userID from storage:", auth.userID); // Debug log
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Debug log for userID changes
  useEffect(() => {
    console.log("Current userID:", userID);
  }, [userID]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        userID,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
