import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const googleClientID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";

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

export const diaryOperations = {
  createEntry: async (title: string, content: string, userId: string) => {
    const { data, error } = await supabase
      .from("diary")
      .insert([{ title, content, user_id: userId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  getEntries: async (userId: string) => {
    console.log("Querying diary entries for user:", userId);

    const { data: allData } = await supabase
      .from("diary")
      .select("*");

    console.log("All diary entries:", allData);

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

  deleteEntry: async (id: string) => {
    const { error } = await supabase.from("diary").delete().eq("id", id);

    if (error) throw error;
  },
};
