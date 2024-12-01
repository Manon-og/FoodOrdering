import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useAcceptButtonChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useAcceptButtonChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pendinglocalbatch" },
        (payload) => {
          console.log("Change received!", payload);
          onChange(); // Call the onChange callback when a change is detected
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, [onChange]);
};

export default useAcceptButtonChannel;
