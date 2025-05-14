import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
} from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FeelingEmoticon } from "@/components/FeelingEmoticon";

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
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
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

  const renderEntry = ({ item }: { item: DiaryEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <FeelingEmoticon feeling={item.feeling_id} />
      </View>
      <Text style={styles.entryDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <LogoutButton />
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
  },
  entriesContainer: {
    marginTop: 80,
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
});
