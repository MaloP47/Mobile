import { View, Text, StyleSheet } from "react-native";
import { SimpleLineIcons as Icon } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.GITHUB_CLIENT_ID}`,
};

const redirectUri = makeRedirectUri({
  scheme: "diaryapp",
  path: "/(tabs)/profile",
});

console.log(redirectUri);

export default function SignIn(): JSX.Element {
  const [textColorGithub, setTextColorGithub] = useState<string>("black");
  const [textColorGoogle, setTextColorGoogle] = useState<string>("black");

  const githubClientId = "Ov23liCSANEP6hi57vjH";
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId!,
      scopes: [],
      redirectUri,
    },
    discovery
  );

  console.log(githubClientId);

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Authentication successful, redirecting to profile...");
      router.replace("/(tabs)/profile");
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Sign in</Text>
      <View style={styles.roundedButton}>
        <Icon.Button
          name="social-github"
          color={"black"}
          size={50}
          backgroundColor={"transparent"}
          underlayColor={"#FFA500"}
          onPressIn={() => setTextColorGithub("#FFD700")}
          onPressOut={() => setTextColorGithub("black")}
          onPress={() => {
            console.log("Github sign in pressed");
            promptAsync();
          }}
        >
          <Text style={[styles.signInText, { color: textColorGithub }]}>
            Sign in with Github
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
          onPress={() => {
            console.log("Google sign in pressed");
          }}
        >
          <Text style={[styles.signInText, { color: textColorGoogle }]}>
            Sign in with Google
          </Text>
        </Icon.Button>
      </View>
    </View>
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
