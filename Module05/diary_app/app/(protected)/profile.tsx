import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";
import { FeelingEmoticon } from "@/components/FeelingEmoticon";
import { useButtonAnimation } from "../../components/useButtonAnimation";
import { useAuth } from "@/context/auth";

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
  const [isNewEntryModalVisible, setIsNewEntryModalVisible] = useState(false);
  const [entryCount, setEntryCount] = useState<number>(0);
  const [feelingPercentages, setFeelingPercentages] = useState<
    Record<FeelingType, number>
  >({
    "very sad": 0,
    sad: 0,
    neutral: 0,
    happy: 0,
    "very happy": 0,
  });
  const [userProfile, setUserProfile] = useState<{
    avatar_url: string | null;
    full_name: string | null;
  }>({
    avatar_url: null,
    full_name: null,
  });
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    feeling_id: "neutral" as FeelingType,
    date: new Date().toISOString().split("T")[0],
  });
  const { userID } = useAuth();

  const calculateFeelingPercentages = async () => {
    try {
      const { data: allEntries, error: allEntriesError } = await supabase
        .from("diary")
        .select("feeling_id")
        .eq("user_id", userID);

      if (allEntriesError) {
        console.error("Error fetching all entries:", allEntriesError.message);
        return;
      }

      if (allEntries) {
        const feelingCounts: Record<FeelingType, number> = {
          "very sad": 0,
          sad: 0,
          neutral: 0,
          happy: 0,
          "very happy": 0,
        };

        allEntries.forEach((entry) => {
          feelingCounts[entry.feeling_id as FeelingType]++;
        });

        const percentages: Record<FeelingType, number> = {
          "very sad": 0,
          sad: 0,
          neutral: 0,
          happy: 0,
          "very happy": 0,
        };

        Object.keys(feelingCounts).forEach((feeling) => {
          percentages[feeling as FeelingType] =
            (feelingCounts[feeling as FeelingType] / allEntries.length) * 100;
        });

        setFeelingPercentages(percentages);
      }
    } catch (error: any) {
      console.error("Error calculating feeling percentages:", error.message);
    }
  };

  useEffect(() => {
    const getEntries = async () => {
      try {
        if (!userID) {
          console.error("No user ID available");
          return;
        }

        // Fetch total count of entries
        const { count, error: countError } = await supabase
          .from("diary")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userID);

        if (countError) {
          console.error("Error fetching entry count:", countError.message);
          return;
        }

        setEntryCount(count || 0);

        const { data, error } = await supabase
          .from("diary")
          .select("*")
          .eq("user_id", userID)
          .order("created_at", { ascending: false })
          .limit(2);

        if (error) {
          console.error("Error fetching entries:", error.message);
          return;
        }

        if (data) {
          console.log("Number of entries found:", data.length);
          setEntries(data as DiaryEntry[]);
        }

        // Calculate feeling percentages
        await calculateFeelingPercentages();
      } catch (error: any) {
        console.error("Error in getEntries:", error.message);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          setUserProfile({
            avatar_url: user.user_metadata?.avatar_url || null,
            full_name: user.user_metadata?.full_name || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getEntries();
    fetchUserProfile();
  }, [userID]);

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase.from("diary").delete().eq("id", entryId);

      if (error) {
        console.error("Error deleting entry:", error.message);
        Alert.alert("Error", "Failed to delete entry");
        return;
      }

      // Fetch the latest 2 entries after deletion
      const { data: updatedData, error: fetchError } = await supabase
        .from("diary")
        .select("*")
        .eq("user_id", userID)
        .order("created_at", { ascending: false })
        .limit(2);

      if (fetchError) {
        console.error("Error fetching updated entries:", fetchError.message);
        return;
      }

      if (updatedData) {
        setEntries(updatedData as DiaryEntry[]);
      }

      // Update entry count after deletion
      const { count, error: countError } = await supabase
        .from("diary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userID);

      if (!countError) {
        setEntryCount(count || 0);
      }

      // Recalculate feeling percentages
      await calculateFeelingPercentages();

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

  const handleCreateEntry = async () => {
    try {
      // Validate empty fields
      if (!newEntry.title.trim()) {
        Alert.alert("Error", "Title cannot be empty");
        return;
      }
      if (!newEntry.content.trim()) {
        Alert.alert("Error", "Content cannot be empty");
        return;
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(newEntry.date)) {
        Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format");
        return;
      }
      const date = new Date(newEntry.date);
      if (isNaN(date.getTime())) {
        Alert.alert("Error", "Please enter a valid date");
        return;
      }

      const { data, error } = await supabase
        .from("diary")
        .insert([
          {
            title: newEntry.title,
            content: newEntry.content,
            feeling_id: newEntry.feeling_id,
            date: newEntry.date,
            user_id: userID,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating entry:", error.message);
        Alert.alert("Error", "Failed to create entry");
        return;
      }

      if (data) {
        const updatedEntries = [...entries, data[0]]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 2);
        setEntries(updatedEntries);

        // Update entry count after creation
        const { count, error: countError } = await supabase
          .from("diary")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userID);

        if (!countError) {
          setEntryCount(count || 0);
        }

        // Recalculate feeling percentages
        await calculateFeelingPercentages();

        setIsNewEntryModalVisible(false);
        setNewEntry({
          title: "",
          content: "",
          feeling_id: "neutral",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error: any) {
      console.error("Error in handleCreateEntry:", error.message);
      Alert.alert("Error", "An unexpected error occurred");
    }
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

  const renderNewEntryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isNewEntryModalVisible}
      onRequestClose={() => {
        setIsNewEntryModalVisible(false);
        setNewEntry({
          title: "",
          content: "",
          feeling_id: "neutral",
          date: new Date().toISOString().split("T")[0],
        });
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>New Entry</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={"orange"}
                value={newEntry.title}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, title: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={"orange"}
                value={newEntry.date}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, date: text })
                }
              />
              <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Write your thoughts..."
                placeholderTextColor={"orange"}
                value={newEntry.content}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, content: text })
                }
                multiline
              />
              <View style={styles.feelingSelector}>
                {["sad", "very sad", "neutral", "happy", "very happy"].map(
                  (feeling) => (
                    <TouchableOpacity
                      key={feeling}
                      onPress={() =>
                        setNewEntry({
                          ...newEntry,
                          feeling_id: feeling as FeelingType,
                        })
                      }
                      style={[
                        styles.feelingButton,
                        newEntry.feeling_id === feeling &&
                          styles.selectedFeeling,
                      ]}
                    >
                      <FeelingEmoticon
                        feeling={feeling as FeelingType}
                        size={30}
                      />
                    </TouchableOpacity>
                  )
                )}
              </View>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsNewEntryModalVisible(false);
                    setNewEntry({
                      title: "",
                      content: "",
                      feeling_id: "neutral",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleCreateEntry}
                >
                  <Text style={styles.saveButtonText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {userProfile.avatar_url ? (
            <Image
              source={{ uri: userProfile.avatar_url }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>
                {userProfile.full_name?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <Text style={styles.profileName}>
            {userProfile.full_name || "Anonymous User"}
          </Text>
        </View>
        <LogoutButton />
      </View>

      <View style={styles.entriesContainer}>
        <Text style={styles.entriesTitle}>Latest entries</Text>
        {entries.length === 0 ? (
          <View style={styles.noEntriesText}>
            <Text style={styles.noEntriesText}>Add your first entry</Text>
          </View>
        ) : (
          <View style={styles.entriesList}>
            {entries.map((item) => (
              <View key={item.id}>{renderEntry({ item })}</View>
            ))}
          </View>
        )}
      </View>

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
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Your feel for your {entryCount} entries
        </Text>
        <View style={styles.feelingStatsContainer}>
          {Object.entries(feelingPercentages).map(([feeling, percentage]) => (
            <View key={feeling} style={styles.feelingStatItem}>
              <FeelingEmoticon feeling={feeling as FeelingType} size={30} />
              <Text style={styles.feelingStatText}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <AnimatedTouchableOpacity
          style={[styles.button, { backgroundColor }]}
          onPress={() => setIsNewEntryModalVisible(true)}
        >
          <Text style={styles.buttonTxt}>New entry</Text>
        </AnimatedTouchableOpacity>
      </View>
      {renderNewEntryModal()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flex: 4,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 75,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginRight: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  profileImagePlaceholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    fontFamily: "Pacifico",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Pacifico",
    color: "#333",
  },
  entriesContainer: {
    flex: 6,
    padding: 10,
    borderWidth: 5,
    borderColor: "black",
    borderRadius: 10,
    margin: 5,
  },
  entriesTitle: {
    fontSize: 20,
    fontFamily: "Pacifico",
    color: "black",
    marginBottom: 15,
    textAlign: "center",
  },
  statsContainer: {
    flex: 3,
    padding: 10,
    borderWidth: 5,
    borderColor: "black",
    borderRadius: 10,
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  statsText: {
    fontSize: 20,
    fontFamily: "Pacifico",
    color: "black",
    textAlign: "center",
  },
  footer: {
    flex: 2,
    // backgroundColor: "yellow",
    padding: 5,
    // justifyContent: "center",
    // alignItems: "center",
  },
  scrollView: {
    flex: 3,
    padding: 10,
    paddingBottom: 100,
    backgroundColor: "pink",
  },
  headerText: {
    fontSize: 24,
  },
  entryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    // width: "90%",
    height: 75,
    // alignItems: "center",
    justifyContent: "center",
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
    margin: 10,
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
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  contentInput: {
    height: 150,
    textAlignVertical: "top",
  },
  feelingSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  feelingButton: {
    padding: 10,
    borderRadius: 20,
  },
  selectedFeeling: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Pacifico",
  },
  noEntriesText: {
    fontSize: 28,
    fontFamily: "Pacifico",
    textAlign: "center",
    color: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  entriesList: {
    width: "100%",
    flex: 1,
  },
  feelingStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  feelingStatItem: {
    alignItems: "center",
  },
  feelingStatText: {
    fontSize: 16,
    fontFamily: "Pacifico",
    color: "black",
    marginTop: 5,
  },
});
