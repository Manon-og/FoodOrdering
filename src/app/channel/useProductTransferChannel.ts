import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useProductTransferChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useProductTransferChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stockmovement" },
        (payload) => {
          console.log("Change receisssved!", payload);
          onChange(); // Call the onChange callback when a change is detected
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, [onChange]);
};

export default useProductTransferChannel;
