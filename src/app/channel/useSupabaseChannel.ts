import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";

const useSupabaseChannel = () => {
  useEffect(() => {
    const channels = supabase
      .channel("useSupabaseChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, []);
};

export default useSupabaseChannel;
