import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useQuantityProductChannel = () => {
  //   useEffect(() => {
  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "batch" },
      (payload) => {
        // const { category } = useCategoryStore();
        // const { data: productsByBackInventory } = useBackInventoryProductList(
        //   category ?? ""
        // );
        console.log("Change received!", payload);
        // console.log("Change received!", payload);
      }
    )
    .subscribe();

  return () => {
    channels.unsubscribe();
  };
  //   }, []);
};

export default useQuantityProductChannel;
