import { TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export function LogoutButton() {
  const { logOut } = useAuth();

  return (
    <TouchableOpacity style={styles.container} onPress={logOut}>
      <MaterialCommunityIcons name="logout" size={30} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    padding: 10,
  },
});
