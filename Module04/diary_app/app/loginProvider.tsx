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
      webClientId: googleClientID
    });
  }, []);

  const handleProviderLogin = async (provider: "github" | "google") => {
    if (provider === "google") {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log(JSON.stringify(userInfo, null, 2));

        if (userInfo.data.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: userInfo.data.idToken,
          });

          if (error) {
            console.error("Supabase auth error:", error);
            return;
          }

          // If successful, log in and navigate
          authContext.logIn();
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
      // Existing GitHub login logic
      console.log(`${provider} sign in pressed`);
      authContext.logIn();
      router.replace("/(protected)/profile");
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
