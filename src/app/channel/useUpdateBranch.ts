import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

const useUpdateBranchChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useUpdateBranchChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "branch" },
        (payload) => {
          console.log("Change received!", payload);
          onChange();
        }
      )
      .subscribe();

    console.log("Subscribed to branch changes");

    return () => {
      console.log("Unsubscribing from branch changes");
      channels.unsubscribe();
    };
  }, [onChange]);
};

export default useUpdateBranchChannel;
