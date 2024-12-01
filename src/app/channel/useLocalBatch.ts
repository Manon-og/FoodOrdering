import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useLocalBatchChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useLocalBatchChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "localbatch" },
        (payload) => {
          console.log("Change receissved!", payload);
          onChange(); // Call the onChange callback when a change is detected
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, [onChange]);
};

export default useLocalBatchChannel;
