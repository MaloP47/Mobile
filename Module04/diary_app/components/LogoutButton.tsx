import { TouchableOpacity, StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";

export function LogoutButton() {
  const { logOut } = useAuth();

  return (
    <TouchableOpacity style={styles.container} onPress={logOut}>
      <SimpleLineIcons name="logout" size={24} color="black" />
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
