import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function ProfileScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Profile Page</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "Pacifico",
  },
});
