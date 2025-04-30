import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { SimpleLineIcons as Icon } from "@expo/vector-icons";

export default function ProfilePage(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>John Doe</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>john@example.com</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
  },
}); 
