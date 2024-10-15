import { supabase } from "@/src/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useProductList = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, id_price(amount)`)
        .eq("id_category", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useArchiveIdProducts = (id: number) => {
  return useQuery({
    queryKey: ["batch", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select(`*, id_products(*)`)
        .eq("id_category", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProductListArchive = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, id_price(amount)`);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBranchProductList = (id: string, idB: string) => {
  return useQuery({
    queryKey: ["batch", id, idB],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select(`*, id_products(*)`)
        .eq("id_products.id_category", id)
        .eq("id_branch", idB)
        .not("id_products", "is", null);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, id_price(amount)")
        .eq("id_products", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProduct = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: existingProduct, error: existingProductError } =
        await supabase
          .from("products")
          .select("*")
          .eq("name", data.name)
          .single();
      if (existingProductError && existingProductError.code !== "PGRST116") {
        throw new Error(existingProductError.message);
      }
      if (existingProduct) {
        throw new Error("Product already exists.");
      }

      const { data: newIdPrice }: { data: any } = await supabase
        .from("price")
        .select("id_price")
        .eq("amount", data.id_price.amount)
        .single();
      console.log("price", newIdPrice);
      if (newIdPrice) {
        const { data: updateProduct, error } = await supabase
          .from("products")
          .insert({
            name: data.name,
            description: data.description,
            image: data.image,
            id_price: newIdPrice.id_price,
            id_category: id,
          })
          .eq("id_products", data.id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
        return updateProduct;
      } else {
        console.log("POTA PLEASEEEEEE");
        const { data: newPrice, error: priceError }: { data: any; error: any } =
          await supabase
            .from("price")
            .insert({
              amount: data.id_price.amount,
            })
            .single();

        if (priceError) {
          throw new Error(priceError.message);
        }

        const { data: newIdPrice }: { data: any } = await supabase
          .from("price")
          .select("*")
          .eq("amount", data.id_price.amount)
          .single();
        console.log("POTA PLEASEEEEEE");
        console.log("POTA", newIdPrice);

        const { data: updateProduct, error } = await supabase
          .from("products")
          .insert({
            name: data.name,
            description: data.description,
            image: data.image,
            id_price: newIdPrice.id_price,
            id_category: id,
          })
          .eq("id_products", data.id)
          .single();
        if (error) {
          throw new Error(error.message);
        }

        return updateProduct;
      }
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: newIdPrice }: { data: any } = await supabase
        .from("price")
        .select("id_price")
        .eq("amount", data.id_price.amount)
        .single();
      console.log("price", newIdPrice);

      if (newIdPrice) {
        const { data: updateProduct, error } = await supabase
          .from("products")
          .update({
            name: data.name,
            description: data.description,
            image: data.image,
            id_price: newIdPrice.id_price,
          })
          .eq("id_products", data.id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
      } else {
        console.log("POTA PLEASEEEEEE");
        const { data: newPrice, error: priceError }: { data: any; error: any } =
          await supabase
            .from("price")
            .insert({
              amount: data.id_price.amount,
            })
            .single();

        const { data: newIdPrice }: { data: any } = await supabase
          .from("price")
          .select("*")
          .eq("amount", data.id_price.amount)
          .single();
        console.log("POTA PLEASEEEEEE");
        console.log("POTA", newIdPrice);

        const { data: updateProduct, error } = await supabase
          .from("products")
          .update({
            name: data.name,
            description: data.description,
            image: data.image,
            id_price: newIdPrice.id_price,
          })
          .eq("id_products", data.id)
          .single();
        if (error) {
          throw new Error(error.message);
        }

        return updateProduct;
      }
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
};


export const useInsertBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const { data: newBatch, error } = await supabase.from("batch").insert({
          batch: data.quantity,
          id_products: data.id_products,
        });
        return newBatch;
      } catch (error) {
        console.error("Error inserting batch:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};

export const useBatchList = (id: string) => {
  return useQuery({
    queryKey: ["id_products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select("*, id_products(*), id_branch(*)")
        .eq("id_products", id);
      if (error) {
        console.error("Supabase error:", error); // Log the error object
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBatchListByCategory = (id: string) => {
  return useQuery({
    queryKey: ["batch", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select("*")
        .eq("id_products.id_category", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAvailableBatch = (productId: number) => {
  return useQuery({
    queryKey: ["availableBatch", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select("*")
        .eq("id_products", productId)
        .is("id_branch", null);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBranch = () => {
  return useQuery({
    queryKey: ["branch"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branch").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// export const useInsertBranch = (place : string) => {
//   return useQuery({
//     queryKey: ['branch'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('branch')
//         .insert({
//             place: place
//           })
//       if (error) {
//         throw new Error(error.message);
//       }
//       return data;
//     },
//   });
// }

export const useInsertBranch = (place: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const { data: newBranch, error } = await supabase
          .from("branch")
          .insert({
            place: data.place,
          });
        return newBranch;
      } catch (error) {
        console.error("Error inserting branch:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["branch"] });
    },
  });
};

export const usePriceHistory = (id: number) => {
  return useQuery({
    queryKey: ["pricehistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricehistory")
        .select("*, id_price(*), id_products(*)")
        .eq("id_products", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

  export const useUnarchiveProduct = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase
          .from('products')
          .update({ id_archive: 2 })
          .eq('id_products', id);

        console.log('id', id);
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    });
  };

  export const useArchiveProduct = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase
          .from('products')
          .update({ id_archive: 1 })
          .eq('id_products', id);

        console.log('id', id);
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    });
  };


  export const useSignIn = () => {
    return useMutation({
      mutationFn: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw new Error(error.message);
        }
      },
    });
  };
  
    export const handleLogout = async (router: any) => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/(auth)/sign-in"); // Redirect to sign-in page after logout
      }
    };
    
    export const getUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Error", error.message);
        return null;
      }
      return data?.user?.email || null;
    };
    
    export const getUserFullName = async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Error", error.message);
        return null;
      }
    
      const userId = authData?.user?.id;
      if (!userId) {
        Alert.alert("Error", "User not authenticated");
        return null;
      }
    
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();
    
      if (profileError) {
        Alert.alert("Error", profileError.message);
        return null;
      }
    
      return profileData?.full_name || null;
    };



