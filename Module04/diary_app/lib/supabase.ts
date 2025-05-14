import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);


// Types for diary entries
export type DiaryEntry = {
  id: string;
  user_id: string;
  date: string;
  title: string;
  feeling_id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

// CRUD operations for diary entries
export const diaryOperations = {
  // Create a new diary entry
  createEntry: async (title: string, content: string, userId: string) => {
    const { data, error } = await supabase
      .from("diary")
      .insert([{ title, content, user_id: userId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Read all diary entries for a user
  getEntries: async (userId: string) => {
    console.log("Querying diary entries for user:", userId);

    // First, let's check if we can get any data at all
    const { data: allData, error: allError } = await supabase
      .from("diary")
      .select("*");

    console.log("All diary entries:", allData);

    // Then try our specific query
    const { data, error } = await supabase
      .from("diary")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Filtered data for user:", data);
    return data;
  },

  // Update a diary entry
  updateEntry: async (id: string, title: string, content: string) => {
    const { data, error } = await supabase
      .from("diary")
      .update({ title, content })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete a diary entry
  deleteEntry: async (id: string) => {
    const { error } = await supabase.from("diary").delete().eq("id", id);

    if (error) throw error;
  },
};
