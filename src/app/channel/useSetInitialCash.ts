import { useEffect } from "react";
import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useBackInventoryProductList, useProductList } from "@/api/products";
import { useCategoryStore } from "@/store/categoryAdmin";

const useInitialCashCountChannel = (
  onChange: () => void,
  pollInterval = 3000
) => {
  useEffect(() => {
    console.log("Setting up subscription...");
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "initialcashcount" },
        (payload) => {
          console.log("Change received!", payload);
          onChange(); // Call the onChange callback when a change is detected
        }
      )
      .subscribe();

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from("initialcashcount")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Polling error:", error);
          return;
        }

        if (data && data.length > 0) {
          console.log("Polling data:", data[0]);
          onChange(); // Call the onChange callback when new data is detected
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const intervalId = setInterval(poll, pollInterval);

    return () => {
      console.log("Unsubscribing...");
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [onChange, pollInterval]);
};

export default useInitialCashCountChannel;
