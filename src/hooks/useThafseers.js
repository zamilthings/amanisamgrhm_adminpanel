import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/libs/createClient";

export const useThafseers = (chapterNo = null) => {
  return useQuery({
    queryKey: ["thafseers", chapterNo],
    queryFn: async () => {
      let query = supabase
        .from("thafseers")
        .select("*")
        .order("chapter_no")
        .order("verse_start");

      if (chapterNo && chapterNo !== "all") {
        query = query.eq("chapter_no", parseInt(chapterNo));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60,
  });
};
