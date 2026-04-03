import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/libs/createClient";

export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surahs")
        .select("*")
        .order("id");
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    cacheTime: 1000 * 60 * 60 * 24,
  });
};
