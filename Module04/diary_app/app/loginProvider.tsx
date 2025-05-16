import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SimpleLineIcons as Icon } from "@expo/vector-icons";
import { JSX, useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import { router } from "expo-router";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { googleClientID, supabase } from "@/lib/supabase";

export default function LoginProvider(): JSX.Element {
  const [textColorGithub, setTextColorGithub] = useState<string>("black");
  const [textColorGoogle, setTextColorGoogle] = useState<string>("black");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      webClientId: googleClientID,
    });
  }, []);

  const handleProviderLogin = async (provider: "github" | "google") => {
    if (provider === "google") {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log(JSON.stringify(userInfo, null, 2));

        if (userInfo.data?.idToken) {
          const { data: authData, error } =
            await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data?.idToken,
            });

          if (error) {
            console.error("Supabase auth error:", error);
            return;
          }

          // Get the current user data
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user?.id) {
            console.error("Error getting user:", userError);
            return;
          }

          // Log the user data for debugging
          console.log("User authenticated:", {
            id: user.id,
            email: user.email,
          });

          // Pass the user ID to logIn
          authContext.logIn(user.id);
          router.replace("/(protected)/profile");
        } else {
          throw new Error("No ID token present!");
        }
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("User cancelled the login flow");
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("Operation in progress already");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log("Play services not available or outdated");
        } else {
          console.error("Google Sign-In error:", error);
        }
      }
    } else {
      // GitHub login logic
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
        });
        console.log("data", data);
        console.log("erreur", error);

        if (error) {
          console.error("GitHub auth error:", error);
          return;
        }

        // Get the current user data
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user?.id) {
          console.error("Error getting user:", userError);
          return;
        }

        // Log the user data for debugging
        console.log("User authenticated:", {
          id: user.id,
          email: user.email,
        });

        // Pass the user ID to logIn
        authContext.logIn(user.id);
        router.replace("/(protected)/profile");
      } catch (error) {
        console.error("GitHub Sign-In error:", error);
      }
    }
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("@/assets/images/golden.png")}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* <Text style={styles.textStyle}>Log in</Text> */}
        <View style={styles.roundedButton}>
          <Icon.Button
            name="social-github"
            color={"black"}
            size={50}
            backgroundColor={"transparent"}
            underlayColor={"#FFA500"}
            onPressIn={() => setTextColorGithub("#FFD700")}
            onPressOut={() => setTextColorGithub("black")}
            onPress={() => handleProviderLogin("github")}
          >
            <Text style={[styles.signInText, { color: textColorGithub }]}>
              Log in with Github
            </Text>
          </Icon.Button>
        </View>
        <View style={styles.roundedButton}>
          <Icon.Button
            name="social-google"
            color={"black"}
            size={50}
            backgroundColor={"transparent"}
            underlayColor={"#FFA500"}
            onPressIn={() => setTextColorGoogle("#FFD700")}
            onPressOut={() => setTextColorGoogle("black")}
            onPress={() => handleProviderLogin("google")}
          >
            <Text style={[styles.signInText, { color: textColorGoogle }]}>
              Log in with Google
            </Text>
          </Icon.Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 50,
    fontFamily: "Pacifico",
  },
  signInText: {
    fontSize: 20,
    fontFamily: "Pacifico",
  },
  roundedButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 10,
  },
});
