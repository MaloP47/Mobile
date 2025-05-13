import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SimpleLineIcons as Icon } from "@expo/vector-icons";
import { JSX, useState, useContext } from "react";
import { AuthContext } from "@/context/auth";
import { router } from "expo-router";

export default function LoginProvider(): JSX.Element {
  const [textColorGithub, setTextColorGithub] = useState<string>("black");
  const [textColorGoogle, setTextColorGoogle] = useState<string>("black");
  const authContext = useContext(AuthContext);

  const handleProviderLogin = (provider: "github" | "google") => {
    console.log(`${provider} sign in pressed`);
    // Simulate successful login
    authContext.logIn();
    // Navigate to profile page
    router.replace("/(protected)/profile");
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
