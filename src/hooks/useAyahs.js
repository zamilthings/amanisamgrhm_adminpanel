import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/libs/createClient";

export const useAyahs = (chapterNo) => {
  return useQuery({
    queryKey: ["ayahs", chapterNo],
    queryFn: async () => {
      if (!chapterNo) return [];
      const { data, error } = await supabase
        .from("ayahs")
        .select("*")
        .eq("chapter_no", chapterNo)
        .order("verse_no");
      if (error) throw error;
      return data || [];
    },
    enabled: !!chapterNo,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60,
  });
};
