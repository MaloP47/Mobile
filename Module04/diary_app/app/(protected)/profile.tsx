import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FeelingEmoticon } from "@/components/FeelingEmoticon";
import { useButtonAnimation } from "../../components/useButtonAnimation";

type FeelingType = "very sad" | "sad" | "neutral" | "happy" | "very happy";

interface DiaryEntry {
  date: string | number | Date;
  feeling_id: FeelingType;
  id: string;
  title: string;
  content: string;
  created_at: string;
  feeling: FeelingType;
}

export default function ProfileScreen() {
  const { AnimatedTouchableOpacity, backgroundColor } = useButtonAnimation();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = "eb3fe3a9-d258-48f2-ba72-764eda30d3b8";

  useEffect(() => {
    const getEntries = async () => {
      try {
        const { data, error } = await supabase.from("diary").select("*");

        console.log("Raw query result:", { data, error });

        if (error) {
          console.error("Error fetching entries:", error.message);
          return;
        }

        if (data) {
          console.log("All entries in table:", data);
          console.log("Number of entries found:", data.length);

          if (data.length > 0) {
            console.log("First entry structure:", {
              id: data[0].id,
              user_id: data[0].user_id,
              title: data[0].title,
              content: data[0].content,
              created_at: data[0].created_at,
              feeling: data[0].feeling_id,
            });
          }

          // Sort entries by date in descending order
          const sortedEntries = [...data].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

          setEntries(sortedEntries as DiaryEntry[]);
        } else {
          console.log("No data returned from query");
        }
      } catch (error: any) {
        console.error("Error in getEntries:", error.message);
      }
    };

    getEntries();
  }, []);

  const handleDeleteEntry = async (entryId: string) => {
    try {
      // Use a more specific delete query
      const { error } = await supabase.from("diary").delete().eq("id", entryId);

      if (error) {
        console.error("Error deleting entry:", error.message);
        Alert.alert("Error", "Failed to delete entry");
        return;
      }

      // Update local state
      setEntries(entries.filter((entry) => entry.id !== entryId));
      setIsModalVisible(false);
      setSelectedEntry(null);
    } catch (error: any) {
      console.error("Error in handleDeleteEntry:", error.message);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const showDeleteConfirmation = (entry: DiaryEntry) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteEntry(entry.id),
      },
    ]);
  };

  const renderEntry = ({ item }: { item: DiaryEntry }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => {
        setSelectedEntry(item);
        setIsModalVisible(true);
      }}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <FeelingEmoticon feeling={item.feeling_id} />
      </View>
      <Text style={styles.entryDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <View style={styles.header}>
        <LogoutButton />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.entriesContainer}>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.date.toString()}
            renderItem={renderEntry}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
          setSelectedEntry(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEntry && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEntry.title}</Text>
                  <FeelingEmoticon
                    feeling={selectedEntry.feeling_id}
                    size={30}
                  />
                </View>
                <Text style={styles.modalDate}>
                  {new Date(selectedEntry.date).toLocaleDateString()}
                </Text>
                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalText}>{selectedEntry.content}</Text>
                </ScrollView>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setIsModalVisible(false);
                      setSelectedEntry(null);
                    }}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => showDeleteConfirmation(selectedEntry)}
                  >
                    <Text style={styles.deleteButtonText}>Delete Entry</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <AnimatedTouchableOpacity
          style={[styles.button, { backgroundColor }]}
          onPress={() => {
            console.log("New entry");
          }}
        >
          <Text style={styles.buttonTxt}>New entry</Text>
        </AnimatedTouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
    // backgroundColor: "red",
  },
  header: {
    // backgroundColor: "red",
    height: 65,
  },
  headerText: {
    fontSize: 24,
  },
  entriesContainer: {
    gap: 15,
  },
  entryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  entryTitle: {
    fontSize: 20,
    fontFamily: "Pacifico",
    flex: 1,
  },
  entryContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  footer: {
    // backgroundColor: "red",
    height: 100,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },
  buttonTxt: {
    fontSize: 24,
    fontFamily: "Pacifico",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Pacifico",
    flex: 1,
  },
  modalDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  modalScrollView: {
    maxHeight: "60%",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
    gap: 10,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    borderRadius: 25,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#666",
    borderRadius: 25,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Pacifico",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Pacifico",
  },
});
