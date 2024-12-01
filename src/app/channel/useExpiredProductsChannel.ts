import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useExpiredProductsChannel = (onChange: () => void) => {
  useEffect(() => {
    const channels = supabase
      .channel("useExpiredProductsChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expiredproducts" },
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

export default useExpiredProductsChannel;
