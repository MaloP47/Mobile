import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useButtonAnimation } from "../components/useButtonAnimation";
import { router } from "expo-router";

export default function HomeScreen() {
  const { AnimatedTouchableOpacity, backgroundColor } =
    useButtonAnimation();

  return (
    <View style={styles.central}>
      <Text style={styles.textOne}>Welcome To Your</Text>
      <Text style={styles.textTwo}>Diary</Text>
      <View style={styles.buttonZone}>
        <AnimatedTouchableOpacity
          style={[styles.buttonLogin, { backgroundColor }]}
          onPress={() => {
            console.log("Login");
          }}
        >
          <Text style={styles.buttonTxt}>Login</Text>
        </AnimatedTouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imgBg: {
    flex: 1,
  },
  central: {
    //?? Need to space a bit things
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
    // backgroundColor: "blue",
  },
  textOne: {
    color: "black",
    fontSize: 40,
    fontFamily: "Pacifico",
    // backgroundColor: "orange",
  },
  textTwo: {
    color: "black",
    fontSize: 40,
    fontFamily: "Pacifico",
    // backgroundColor: "yellow",
  },
  buttonZone: {
    // backgroundColor: "green",
  },
  loginButtonGoogle: {
    // backgroundColor: "pink",
    marginHorizontal: 15,
  },
  loginButtonGithub: {
    // backgroundColor: "pink",
    marginHorizontal: 15,
  },
  buttonTxt: {
    color: "black",
    fontSize: 26,
    fontFamily: "Pacifico",
    textAlign: "center",
    lineHeight: 40,
  },
  buttonLogin: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },
  buttonLoginView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
