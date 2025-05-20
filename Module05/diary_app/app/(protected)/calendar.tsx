import React, { useState, useEffect, useCallback } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LogoutButton } from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";
import { FeelingEmoticon } from "@/components/FeelingEmoticon";
import { useAuth } from "@/context/auth";
import { useFocusEffect } from "@react-navigation/native";

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

export default function CalendarScreen() {
  const [selected, setSelected] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userID } = useAuth();

  const getEntries = useCallback(async () => {
    try {
      if (!userID) {
        console.error("No user ID available");
        return;
      }

      const { data, error } = await supabase
        .from("diary")
        .select("*")
        .eq("user_id", userID)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching entries:", error.message);
        return;
      }

      if (data) {
        setEntries(data as DiaryEntry[]);
      }
    } catch (error: any) {
      console.error("Error in getEntries:", error.message);
    }
  }, [userID]);

  // Use useFocusEffect to refresh entries when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getEntries();
    }, [getEntries])
  );

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase.from("diary").delete().eq("id", entryId);

      if (error) {
        console.error("Error deleting entry:", error.message);
        Alert.alert("Error", "Failed to delete entry");
        return;
      }

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

  const filteredEntries = entries.filter(
    (entry) => entry.date.toString().split("T")[0] === selected
  );

  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <View style={styles.header}>
        <LogoutButton />
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          hideExtraDays={true}
          theme={{
            arrowColor: "black",
            backgroundColor: "yellow",
            calendarBackground: "transparent",
            textSectionTitleColor: "black",
            selectedDayBackgroundColor: "black",
            selectedDayTextColor: "orange",
            todayTextColor: "orange",
            dayTextColor: "black",
            textDisabledColor: "black",
            todayBackgroundColor: "yellow",
          }}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "black",
            },
          }}
        />
      </View>
      <View style={styles.footer}>
        <ScrollView style={styles.entriesScrollView}>
          {selected ? (
            filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <View key={entry.id}>{renderEntry({ item: entry })}</View>
              ))
            ) : (
              <Text style={styles.noEntriesText}>No entries for this date</Text>
            )
          ) : (
            <Text style={styles.noEntriesText}>
              Select a date to view entries
            </Text>
          )}
        </ScrollView>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 2.5,
    padding: 0,
    borderWidth: 5,
    borderColor: "black",
    borderRadius: 10,
    margin: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  header: {
    flex: 0.5,
    padding: 10,
  },
  footer: {
    flex: 2,
    padding: 0,
    borderWidth: 5,
    borderColor: "black",
    borderRadius: 10,
    margin: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  entriesScrollView: {
    flex: 1,
    padding: 10,
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
  entryDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  noEntriesText: {
    fontSize: 24,
    fontFamily: "Pacifico",
    textAlign: "center",
    color: "black",
    marginTop: 20,
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
