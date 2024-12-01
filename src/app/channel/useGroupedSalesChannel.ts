import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useGroupedSalesChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useGroupedSalesChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "salestransaction" },
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

export default useGroupedSalesChannel;
