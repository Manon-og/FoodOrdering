import { supabase, supabaseAdmin } from "@/src/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { Branch } from "@/src/types";
import { v4 as uuidv4 } from "uuid";
import uuid from "react-native-uuid";

export const useProductList = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, id_price(amount), category(*)`)
        .eq("id_category", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAllProductList = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) {
        throw new Error(productsError.message);
      }

      // Fetch prices
      const { data: prices, error: pricesError } = await supabase
        .from("price")
        .select("id_price, amount");

      if (pricesError) {
        throw new Error(pricesError.message);
      }

      // Combine products with their prices
      const combinedData = products.map((product) => {
        const price = prices.find((p) => p.id_price === product.id_price);
        return {
          ...product,
          price: price ? price.amount : null,
        };
      });

      return combinedData;
    },
  });
};

export const useFetchCategoryById = (id: number) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .eq("id_category", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// export const useCombinedProductList = (id: string) => {
//   const { data: productList, error: productListError } = useProductList(id);
//   const { data: batchList, error: batchListError } =
//     useTransferBackInventoryProductList();

//   if (productListError) {
//     throw new Error(productListError.message);
//   }

//   if (batchListError) {
//     throw new Error(batchListError.message);
//   }

//   if (!productList || !batchList) {
//     return [];
//   }

//   // Combine product list with batch quantities
//   const combinedData = productList.map((product) => {
//     const batchItem = batchList.find(
//       (batch) => batch.id_products === product.id_products
//     );
//     return {
//       ...product,
//       quantity: batchItem ? batchItem : 0,
//     };
//   });

//   return combinedData;
// };

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

interface LocalBatch {
  id_batch: string;
  id_products: {
    id_products: string;
    id_category: string;
    name: string;
  };
  id_branch: string;
  quantity: number;
}

export const useBranchProductList = (id: string, idB: string | null) => {
  return useQuery({
    queryKey: ["batch", id, idB],
    queryFn: async () => {
      if (!idB) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from("localbatch")
          .select(`*, id_products(*), id_branch(*)`)
          .eq("id_products.id_category", id)
          .eq("id_branch", idB)
          .not("id_products", "is", null);

        if (error) {
          console.error("select??? localbatch", error);
          throw new Error(error.message);
        }

        const groupedData = data.reduce((acc: any, item: LocalBatch) => {
          const productId = item.id_products.id_products;
          if (!acc[productId]) {
            acc[productId] = {
              ...item.id_products,
              quantity: 0,
              id_branch: item.id_branch,
            };
          }
          acc[productId].quantity += item.quantity;
          return acc;
        }, {});

        console.log("CARTT", groupedData);

        return Object.values(groupedData);
      } catch (error) {
        console.error("Error fetching branch product list:", error);
        throw error;
      }
    },
  });
};

export const useLimitQuantity = (idB: string | null) => {
  return useQuery({
    queryKey: ["batch", idB],
    queryFn: async () => {
      if (!idB) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from("localbatch")
          .select(`*, id_products(*), id_branch(*)`)

          .eq("id_branch", idB)
          .not("id_products", "is", null);

        if (error) {
          console.error("select??? localbatch", error);
          throw new Error(error.message);
        }

        const groupedData = data.reduce((acc: any, item: LocalBatch) => {
          const productId = item.id_products.id_products;
          if (!acc[productId]) {
            acc[productId] = {
              ...item.id_products,
              quantity: 0,
              id_branch: item.id_branch,
            };
          }
          acc[productId].quantity += item.quantity;
          return acc;
        }, {});

        console.log("CARTT", groupedData);

        return Object.values(groupedData);
      } catch (error) {
        console.error("Error fetching branch product list:", error);
        throw error;
      }
    },
  });
};

export const useSettedBranchProductList = (
  id: string,
  idB: string | null,
  date: string
) => {
  return useQuery({
    queryKey: ["setBatch", id, idB, date],
    queryFn: async () => {
      if (!idB) {
        return [];
      }
      try {
        const { data: pendinglocalbatch, error: pendingError } = await supabase
          .from("pendinglocalbatch")
          .select("*")
          .eq("id_branch", idB);
        // .eq("date", date);

        console.log("PENDING!!!", pendinglocalbatch);

        if (pendingError) {
          console.error("select pendinglocalbatch", pendingError);
          throw new Error(pendingError.message);
        }

        if (pendinglocalbatch && pendinglocalbatch.length > 0) {
          const insertPromises = pendinglocalbatch.map((batch) =>
            supabase.from("localbatch").insert({
              id_branch: batch.id_branch,
              id_batch: batch.id_batch,
              quantity: batch.quantity,
              id_products: batch.id_products,
            })
          );

          const insertResults = await Promise.all(insertPromises);

          insertResults.forEach(({ error: insertError }) => {
            if (insertError) {
              console.error("insert localbatch", insertError);
              throw new Error(insertError.message);
            }
          });

          const { error: deleteError } = await supabase
            .from("pendinglocalbatch")
            .delete()
            .eq("date", date);

          if (deleteError) {
            console.error("delete pendinglocalbatch", deleteError);
            throw new Error(deleteError.message);
          }
        }

        const { data, error } = await supabase
          .from("localbatch")
          .select(`*, id_products(*), id_branch(*)`)
          .eq("id_products.id_category", id)
          .eq("id_branch", idB)
          .not("id_products", "is", null);

        if (error) {
          console.error("select localbatch", error);
          throw new Error(error.message);
        }

        const groupedData = data.reduce((acc: any, item: LocalBatch) => {
          const productId = item.id_products.id_products;
          if (!acc[productId]) {
            acc[productId] = {
              ...item.id_products,
              quantity: 0,
              id_branch: item.id_branch,
            };
          }
          acc[productId].quantity += item.quantity;
          return acc;
        }, {});

        console.log("CARTT", groupedData);

        return Object.values(groupedData);
      } catch (error) {
        console.error("Error fetching branch product list:", error);
        throw error;
      }
    },
  });
};

export const useBackInventoryProductList = (id: string) => {
  return useQuery({
    queryKey: ["backInventory", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select(`*, id_products(*)`)
        .eq("id_products.id_category", id)
        .not("id_products", "is", null);
      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const productId = item.id_products.id_products;
        console.log("IM HIR RIGHT NOW)))", productId);
        if (!acc[productId]) {
          acc[productId] = { ...item.id_products, quantity: 0 };
        }
        acc[productId].quantity += item.quantity;
        return acc;
      }, {});

      console.log("groupedData####", groupedData);

      return Object.values(groupedData);
      // return data;
    },
  });
};

export const useTransferBackInventoryProductList = () => {
  return useQuery({
    queryKey: ["backInventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select(`*`)
        .not("id_products", "is", null);
      if (error) {
        throw new Error(error.message);
      }

      const combinedData = data.reduce((acc, item) => {
        console.log("item", item.id_products);
        const key = `${item.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
          };
        }
        acc[key].quantity += item.quantity;
        return acc;
      }, {});

      return Object.values(combinedData);
    },
  });
};

export const useBranchAllProductList = (idB: string) => {
  return useQuery({
    queryKey: ["batch", idB],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localbatch")
        .select(`*, id_products(*, category(*)), id_batch(*)`)
        .eq("id_branch", idB)
        .neq("quantity", 0);
      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const productId = item.id_products.id_products;
        if (!acc[productId]) {
          acc[productId] = {
            ...item.id_products,
            quantity: 0,
            before: 0,
            id_batch: item.id_localbranch,
            expiry_date: item.id_batch.expire_date,
          };
        }
        acc[productId].quantity += item.quantity;
        acc[productId].before += item.before;
        return acc;
      }, {});

      console.log("groupedData####", groupedData);

      return Object.values(groupedData);
      // return data;
    },
  });
};

export const useProductForReturnedProducts = (
  id_branch: number,
  id_products: number
) => {
  console.log("ID BRANCH|||", id_branch);
  return useQuery({
    queryKey: ["products", id_branch, id_products],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localbatch")
        .select("*, id_products(*, name), id_batch(*, expire_date)")
        .eq("id_branch", id_branch)
        .eq("id_products", id_products)
        .neq("quantity", 0);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProductByIdForReturnedProducts = (
  id_branch: number,
  id_products: number
) => {
  console.log("ID BRANCH|||", id_branch);
  return useQuery({
    queryKey: ["products", id_branch, id_products],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confirmedproducts")
        .select("*, id_products(*, name), id_batch(*, expire_date)")
        .eq("id_branch", id_branch)
        .eq("id_products", id_products)
        .neq("quantity", 0);

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

export const useProductQuantity = (id: number) => {
  return useQuery({
    queryKey: ["quantity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localbatch")
        .select("*, id_batch(*), id_products(*)")
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
            shelf_life: data.expiry,
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
            shelf_life: data.expiry,
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
            shelf_life: data.expiry,
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
            shelf_life: data.expiry,
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
        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id_products", data.id_products)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const expireDate: any = [];
        const { data: newBatch, error: insertError } = await supabase
          .from("batch")
          .insert({
            quantity: data.quantity,
            id_products: data.id_products,
            id_group: data.idGroup,
          })
          .select("*, id_products(*)");

        if (insertError) {
          throw insertError;
        }

        expireDate.push(newBatch);
        console.log("expireDate 1", expireDate);

        // expireDate.push(newBatch);
        // console.log("expireDate 2", expireDate);

        const allIdBatches = expireDate.flatMap((batchArray: any[]) =>
          batchArray.map((batch) => batch.id_batch)
        );

        console.log("ALL ID BATCHES:", allIdBatches);

        console.log("shelfLife??", productData.shelf_life);
        const createdAt = new Date();
        const updatedExpiryDate = new Date(createdAt);
        updatedExpiryDate.setDate(createdAt.getDate() + productData.shelf_life);

        console.log("OPPSSSSSS IT WORKS", updatedExpiryDate);

        const { data: updatedBatch, error: updatedBatchError } = await supabase
          .from("batch")
          .update({
            expire_date: updatedExpiryDate,
          })
          .eq("id_batch", allIdBatches[0]);

        if (updatedBatchError) {
          throw updatedBatchError;
        }

        console.log("OPPSSSSSS IT WORKS", expireDate);

        console.log("ID", data.id_products);
        console.log("productData", productData);
        console.log("productData", productData.quantity);
        const newQuantity = productData.quantity + data.quantity;
        console.log("newQuantity", newQuantity);
        const { data: updatedProduct, error: updateError } = await supabase
          .from("products")
          .update({ quantity: newQuantity })
          .eq("id_products", data.id_products)
          .single();

        if (updateError) {
          throw updateError;
        }

        return newBatch;
      } catch (error) {
        console.error("Error inserting batch:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["batches"] });
      await queryClient.invalidateQueries({ queryKey: ["batch"] });
      await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
      await queryClient.invalidateQueries({ queryKey: ["id_products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["backInventory"] });
      await queryClient.invalidateQueries({ queryKey: ["setBatch"] });
    },
  });
};

// onSuccess: async (data) => {
//   await queryClient.invalidateQueries({ queryKey: ["batches"] });
//   await queryClient.invalidateQueries({ queryKey: ["batch"] });
//   await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
//   await queryClient.invalidateQueries({ queryKey: ["id_products"] });
//   await queryClient.invalidateQueries({ queryKey: ["products"] });
//   await queryClient.invalidateQueries({ queryKey: ["backInventory"] });
//   await queryClient.invalidateQueries({ queryKey: ["setBatch"] });
// },

export const useBatchList = (id: string) => {
  return useQuery({
    queryKey: ["id_products", id],
    queryFn: async () => {
      const { data: batchData, error: batchError } = await supabase
        .from("batch")
        .select("*, id_products(*)")
        .eq("id_products", id)

        .gt("quantity", 0);
      if (batchError) {
        console.error("Supabase batch error:", batchError);
        throw new Error(batchError.message);
      }

      const { data: localBatchData, error: localBatchError } = await supabase
        .from("localbatch")
        .select("*, id_branch(*), id_batch(*), id_products(*, category(*))")
        .eq("id_products", id)
        .gt("quantity", 0);
      if (localBatchError) {
        console.error("Supabase localbatch error:", localBatchError);
        throw new Error(localBatchError.message);
      }

      const { data: confirmedproductsData, error: confirmedproductsError } =
        await supabase
          .from("confirmedproducts")
          .select("*, id_branch(*), id_batch(*), id_products(*, category(*))")
          .eq("id_products", id)
          .gt("quantity", 0);
      if (confirmedproductsError) {
        console.error("Supabase localbatch error:", confirmedproductsError);
        throw new Error(confirmedproductsError.message);
      }

      const { data: pendingLocalBatchData, error: pendingLocalBatchError } =
        await supabase
          .from("pendinglocalbatch")
          .select("*, id_branch(*), id_batch(*), id_products(*, category(*))")
          .eq("id_products", id)
          .gt("quantity", 0);

      if (pendingLocalBatchError) {
        console.error(
          "Supabase pendinglocalbatch error:",
          pendingLocalBatchError
        );
        throw new Error(pendingLocalBatchError.message);
      }

      const labeledConfirmedProductsData = confirmedproductsData.map(
        (item) => ({
          ...item,
          label: "returned products",
        })
      );
      console.log(
        "labeledConfirmedProductsData____",
        labeledConfirmedProductsData
      );

      console.log(
        "batchData_____",
        batchData.map((item) => item.id_group)
      );

      const combinedData = [
        ...batchData,
        ...localBatchData,
        ...labeledConfirmedProductsData,
        ...pendingLocalBatchData,
      ];

      console.log("combinedData!____", combinedData);

      const groupedData = combinedData.reduce((acc, item) => {
        const productId = item.id_products.id_products;
        const branchId = item.id_branch?.id_branch || "batch";
        const batchId = item.id_batch.id_batch;
        // const confirmedId = item.id_confirmpendingproducts;
        // console.log("confirmedId____", confirmedId);
        console.log(
          "batchData_____",
          batchData.map((item) => item.id_group)
        );
        const groupId =
          item.id_group ||
          item.id_batch?.id_group ||
          item.id_pendinglocalbatch?.id_group;
        console.log("groupId____", groupId);
        // const date = item.date || "batch";
        const localBatchId = item.id_localbatch?.id_localbatch || null;
        const pendingLocalBatchId =
          item.id_pendinglocalbatch?.id_pendinglocalbatch || null;
        const confirmedProductsId = item.id_confirmpendingproducts || null;
        const compositeKey = `${branchId}_${batchId}_${productId}_${groupId}_${confirmedProductsId}`;
        console.log("compositeKey___", compositeKey);

        if (!acc[compositeKey]) {
          acc[compositeKey] = {
            ...item.id_products,
            quantity: 0,
            id_group: item.id_group,
            branch: item.id_branch,
            batch: item.id_batch,
            // date: item.date,
            localBatchId: item.id_localbranch || null,
            confirmedProductsId: item.id_confirmpendingproducts || null,
            pendingLocalBatchId: item.id_pendinglocalbranch || null,
            expire_date: item.expire_date,
            type: item.id_pendinglocalbranch
              ? "pending"
              : item.id_branch
              ? "local"
              : "batch",
            label: item.label || null,
          };
        }
        acc[compositeKey].quantity += item.quantity;
        return acc;
      }, {});

      const groupedDataArray = Object.values(groupedData);

      return groupedDataArray;
    },
  });
};

export const useBatchListQuantity = (ids: string[]) => {
  return useQuery({
    queryKey: ["QUANTITY", ids],
    queryFn: async () => {
      const batchDataArray = await Promise.all(
        ids.map(async (id) => {
          const { data: batchData, error: batchError } = await supabase
            .from("batch")
            .select("*, id_products(*)")
            .eq("id_products", id)
            .gt("quantity", 0);
          if (batchError) {
            console.error("Supabase batch error:", batchError);
            throw new Error(batchError.message);
          }

          const { data: localBatchData, error: localBatchError } =
            await supabase
              .from("localbatch")
              .select(
                "*, id_branch(*), id_batch(*), id_products(*, category(*))"
              )
              .eq("id_products", id)
              .gt("quantity", 0);
          if (localBatchError) {
            console.error("Supabase localbatch error:", localBatchError);
            throw new Error(localBatchError.message);
          }

          const groupedData = localBatchData.reduce((acc, item) => {
            const productId = item.id_products.id_products;
            const branchId = item.id_branch.id_branch;
            const batchId = item.id_batch.id_batch;
            const localBranchId = item.id_localbranch.id_localbranch;
            const compositeKey = `${branchId}_${batchId}_${localBranchId}_${productId}`;

            if (!acc[compositeKey]) {
              acc[compositeKey] = {
                ...item.id_products,
                quantity: 0,
                branch: item.id_branch,
                batch: item.id_batch,
                localbatch: item.id_localbranch,
              };
            }
            acc[compositeKey].quantity += item.quantity;
            return acc;
          }, {});

          const groupedDataArray = Object.values(groupedData);
          return [...(batchData || []), ...groupedDataArray];
        })
      );

      return batchDataArray.flat();
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
    queryKey: ["branch", "specific"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch")
        .select("*")
        .eq("id_archives", 2);
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

export const useInsertBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      place: string;
      street: string;
      city: string;
      postal_code: number;
      // country: string;
    }) => {
      try {
        const { data: newBranch, error } = await supabase
          .from("branch")
          .insert({
            place: data.place,
            street: data.street,
            city: data.city,
            postal_code: data.postal_code,
            id_archives: 2,
          });
        if (error) {
          throw error;
        }
        return newBranch;
      } catch (error) {
        console.error("Error inserting branch:", error);
        throw error;
      }
    },
    onSuccess: async () => {
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
        .from("products")
        .update({ id_archive: 2 })
        .eq("id_products", id);

      console.log("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useArchiveProduct = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase
        .from("products")
        .update({ id_archive: 1 })
        .eq("id_products", id);

      console.log("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAuthenticationLevel = (id: string) => {
  return useQuery({
    queryKey: ["level", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
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

export const fetchEmployees = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, id_roles, birth_date, password");
  if (error) {
    console.error("Error fetching employees:", error);
    throw new Error(error.message);
  }
  return data;
};

export const handleUpdateEmployee = async (
  id: string,
  fullName: string,
  email: string,
  password: string,
  idRoles: number,
  birthDate: string,
  refreshEmployees: () => void,
  router: any
) => {
  // Validate the UUID format of the id
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid UUID format for employee ID");
  }

  // Update the user's email and password using the supabase.auth.admin.updateUserById method
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.updateUserById(id, { email, password });

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      id_roles: idRoles,
      birth_date: birthDate,
      password: password,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating employee:", error);
    throw new Error(error.message);
  }

  if (userError) {
    console.error("Error updating employee email/password:", userError);
    throw new Error(userError.message);
  }

  refreshEmployees();
  router.push("/employees");

  return { data, userData };
};

export const handleCreateEmployee = async (
  fullName: string,
  email: string,
  password: string,
  idRoles: number,
  birthDate: string,
  refreshEmployees: () => void,
  router: any
) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    Alert.alert("Error", error.message);
  } else {
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert([
          {
            id: userId,
            full_name: fullName,
            email,
            id_roles: idRoles,
            birth_date: birthDate,
            password: password,
          },
        ]);

      if (profileError) {
        Alert.alert("Error", profileError.message);
      } else {
        Alert.alert("Success", "Employee created successfully");
        refreshEmployees();
        router.replace("/employees");
      }
    }
  }
};

export const getEmployeeById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, group")
    .eq("id", id)
    .single(); // Ensures a single result

  if (error) {
    console.error("Error fetching employee by ID:", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteEmployee = async (id: string) => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting employee:", error);
    throw new Error(error.message);
  }
};

export const useTransferQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_branch: number;
      id_products: number;
      quantity: number;
    }) => {
      try {
        const { data: batches, error: batchError } = await supabase
          .from("batch")
          .select("*")
          .eq("id_products", data.id_products);
        console.log("batches", batches);

        if (batchError) {
          throw new Error("Error fetching batches");
        }

        let remainingQuantity = data.quantity;
        console.log("Remaining quantity:", remainingQuantity);

        for (const batch of batches) {
          if (remainingQuantity <= 0) break;
          console.log("Batch:", batch);
          console.log("batch.id_batch??", batch.id_batch);

          const transferQuantity = Math.min(batch.quantity, remainingQuantity);
          console.log("TtransferQuantity", transferQuantity);

          const { data: updatedLocalBatch, error: updateError } = await supabase
            .from("localbatch")
            .insert({
              id_branch: data.id_branch,
              id_products: data.id_products,
              id_batch: batch.id_batch,
              quantity: transferQuantity,
            })
            .single();
          console.log("updatedLocalBatch", updatedLocalBatch);

          if (updateError) {
            throw new Error(
              `Error inserting into localbatch table: ${updateError.message}`
            );
          }

          const { data: updatedBatch, error: deductError } = await supabase
            .from("batch")
            .update({
              quantity: batch.quantity - transferQuantity,
            })
            .eq("id_batch", batch.id_batch)
            .single();

          if (deductError) {
            throw new Error(deductError.message);
          }

          remainingQuantity -= transferQuantity;
        }

        return true;
      } catch (error) {
        console.error("Error transferring quantity:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["localbatch", "batch"],
      });
    },
  });
};

export const useSetTransferQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_branch: number;
      id_products: number;
      quantity: number;
      id_group: string;
    }) => {
      try {
        const { data: batches, error: batchError } = await supabase
          .from("batch")
          .select("*")
          .eq("id_products", data.id_products)
          .gt("quantity", 0);

        if (batchError) {
          throw new Error("Error fetching batches");
        }

        console.log("Fetched batches:", batches);
        const groupedBatches = batches
          .reduce((acc, batch) => {
            if (!acc[batch.id_products]) {
              acc[batch.id_products] = [];
            }
            acc[batch.id_products].push(batch);
            return acc;
          }, {})
          [data.id_products]?.sort((a: any, b: any) => {
            return (
              new Date(a.expire_date).getTime() -
              new Date(b.expire_date).getTime()
            );
          });

        if (!groupedBatches || groupedBatches.length === 0) {
          throw new Error("No valid batches found for transfer");
        }

        let remainingQuantityForPending = data.quantity;
        console.log("Initial remaining quantity:", remainingQuantityForPending);

        const insertPromises = [];

        for (const batch of groupedBatches) {
          if (remainingQuantityForPending <= 0) break;

          const transferQuantity = Math.min(
            batch.quantity,
            remainingQuantityForPending
          );

          console.log(
            `Transferring ${transferQuantity} from batch ${batch.id_batch}`
          );

          // Insert into pendinglocalbatch
          insertPromises.push(
            supabase
              .from("pendinglocalbatch")
              .insert({
                id_branch: data.id_branch,
                id_products: data.id_products,
                id_batch: batch.id_batch,
                quantity: transferQuantity,
                id_group: data.id_group,
              })
              .single()
          );

          // Update the quantity in the batch
          insertPromises.push(
            supabase
              .from("batch")
              .update({
                quantity: batch.quantity - transferQuantity,
              })
              .eq("id_batch", batch.id_batch)
              .single()
          );

          remainingQuantityForPending -= transferQuantity;
        }

        await Promise.all(insertPromises);

        console.log(
          "Remaining quantity after transfer:",
          remainingQuantityForPending
        );

        return true;
      } catch (error) {
        console.error("Error transferring quantity:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({
          queryKey: ["localbatch", "batch", "backInventory"],
        });
      } catch (error) {
        console.error("Error invalidating queries:", error);
      }
    },
  });
};
// this is from ABOVE:
// // Fetch updated batches for the given product
// const { data: updatedBatches, error: updatedBatchError } =
//   await supabase
//     .from("batch")
//     .select("*")
//     .eq("id_products", data.id_products);

// if (updatedBatchError) {
//   throw new Error("Error fetching updated batches");
// }

// console.log("updated batches", updatedBatches);

// let remainingQuantity = data.quantity;
// console.log("Remaining quantity:", remainingQuantity);

// // Transfer remaining quantity from batch to localbatch
// const localBatchPromises = updatedBatches.map(async (batch) => {
//   if (remainingQuantity <= 0) return;

//   const transferQuantity = Math.min(batch.quantity, remainingQuantity);
//   console.log("Transfer Quantity:", transferQuantity);

//   const { data: updatedLocalBatch, error: updateError } = await supabase
//     .from("localbatch")
//     .insert({
//       id_branch: data.id_branch,
//       id_products: data.id_products,
//       id_batch: batch.id_batch,
//       quantity: transferQuantity,
//     })
//     .single();

//   if (updateError) {
//     throw new Error(
//       `Error inserting into localbatch table: ${updateError.message}`
//     );
//   }

//   console.log("updatedLocalBatch:", updatedLocalBatch);

//   const { data: updatedBatch, error: deductError } = await supabase
//     .from("batch")
//     .update({
//       quantity: batch.quantity - transferQuantity,
//     })
//     .eq("id_batch", batch.id_batch)
//     .single();

//   if (deductError) {
//     throw new Error(deductError.message);
//   }

//   console.log("updatedBatch:", updatedBatch);

//   remainingQuantity -= transferQuantity;
// });

// await Promise.all(localBatchPromises);

export const useUserTransferQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_localbranch: number;
      id_branch: number;
      id_products: number;
      quantity: number;
      amount: number;
      created_by: string;
      id_group: string;
      amount_by_product: number;
    }) => {
      try {
        // const transactionId = uuidv4();
        // console.log("transactionId", transactionId);
        console.log("id_branch same??", data.id_branch);
        const { data: batches, error: batchError } = await supabase
          .from("localbatch")
          .select("*")
          .eq("id_products", data.id_products)
          .eq("id_branch", data.id_branch)
          .neq("quantity", 0);
        console.log("batches", batches);

        if (batchError) {
          throw new Error("Error fetching batches");
        }

        let remainingQuantity = data.quantity;
        console.log("Remaining quantity:", remainingQuantity);

        for (const batch of batches) {
          if (remainingQuantity <= 0) break;
          console.log("Batch:", batch);
          console.log("batch.id_batch?? YAWA PISTE YAWA", batch.id_localbranch);

          const transferQuantity = Math.min(batch.quantity, remainingQuantity);
          console.log("TtransferQuantity", transferQuantity);

          const { data: updatedLocalBatch, error: updateError } = await supabase
            .from("salestransaction")
            .insert({
              id_localbranch: batch.id_localbranch,
              id_branch: data.id_branch,
              id_products: data.id_products,
              amount: data.amount,
              quantity: transferQuantity,
              created_by: data.created_by,
              id_group: data.id_group,
              amount_by_product: data.amount_by_product,
            })
            .single();
          console.log("updatedLocalBatch", updatedLocalBatch);

          if (updateError) {
            throw new Error(
              `Error inserting into localbatch table: ${updateError.message}`
            );
          }

          const { data: updatedBatch, error: deductError } = await supabase
            .from("localbatch")
            .update({
              quantity: batch.quantity - transferQuantity,
            })
            .eq("id_localbranch", batch.id_localbranch)
            .single();

          if (deductError) {
            throw new Error(deductError.message);
          }

          const { data: ProductTable, error: ProductTableError } =
            await supabase
              .from("products")
              .select("*")
              .eq("id_products", batch.id_products)
              .single();

          const { data: updatedProductTable, error: deductProductTableError } =
            await supabase
              .from("products")
              .update({
                quantity: ProductTable.quantity - transferQuantity,
              })
              .eq("id_products", batch.id_products)
              .single();

          if (deductProductTableError) {
            throw new Error(deductProductTableError.message);
          }

          remainingQuantity -= transferQuantity;
        }

        return true;
      } catch (error) {
        console.error("Error transferring quantity?:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "localbatch",
          "batch",
          "backInventory",
          "sales",
          "groupedSalesTransaction",
          "products",
        ],
      });
    },
  });
};

export const useBranchDetails = (
  place: string,
  street: string,
  city: string,
  postalCode: string,
  country: string
) => {
  return useQuery({
    queryKey: ["branchDetails", place, street, city, postalCode, country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch")
        .select("*")
        .eq("place", place)
        .eq("street", street)
        .eq("city", city)
        .eq("postal_code", postalCode)
        .eq("country", country);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBranchData = () => {
  return useQuery({
    queryKey: ["branch", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branch").select(`*`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useLocalBranchData = () => {
  return useQuery({
    queryKey: ["localbatch"],
    queryFn: async () => {
      const { data, error } = await supabase.from("localbatch").select(`*`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBranchName = (id: number) => {
  return useQuery({
    queryKey: ["branch"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch")
        .select(`place, id_archives`)
        .eq("id_branch", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSalesTransaction = (id_branch: string, date: string) => {
  return useQuery({
    queryKey: ["sales", id_branch, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select(`*, id_products(name), id_branch(place)`)
        .eq("id_branch", id_branch);
      if (error) {
        throw new Error(error.message);
      }

      const salesDATE = data.map((item) => {
        return new Date(item.created_at).toISOString().split("T")[0];
      });

      console.log("002", salesDATE);

      const newSalesDate = salesDATE.filter((item, index) => {
        return salesDATE.indexOf(item) === index;
      });
      console.log("newSalesDate", newSalesDate);

      if (newSalesDate.includes(date)) {
        console.log("IT MATCHES THE DATE AND SALESDATE", date);
        const { data: saleOfTheDay, error: saleOfTheDayError } = await supabase
          .from("salestransaction")
          .select(`*, id_products(name), id_branch(place)`)
          .eq("id_branch", id_branch)
          .gte("created_at", `${date}T00:00:00.000Z`)
          .lt("created_at", `${date}T23:59:59.999Z`);
        if (saleOfTheDayError) {
          throw new Error(saleOfTheDayError.message);
        }

        console.log("saleOfTheDay>", saleOfTheDay);

        return saleOfTheDay;
      }

      return [];
    },
  });
};

export const getLastSignInTime = async (userId: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    console.error("Error fetching last sign-in time:", error);
    throw new Error(error.message);
  }

  console.log("User data:", data); // Log the user data for checking

  return data?.user?.last_sign_in_at;
};

export const useGroupedSalesTransaction = (id_branch: string) => {
  return useQuery({
    queryKey: ["groupedSalesTransaction"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select("*, id_products(name), id_branch(*)")
        .eq("id_branch", id_branch);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        console.log("date HERE", date);
        console.log("itemSSS", item.id_branch.id_branch);
        const key = `${date}_${item.id_group}`;
        if (!acc[key]) {
          acc[key] = {
            id_group: item.id_group,
            id_products: item.id_products,
            id_branch: item.id_branch,
            quantity: 0,
            amount_by_product: 0,
            created_at: date,
            transactions: [],
            created_by: item.created_by,
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].transactions.push(item);

        return acc;
      }, {});
      return Object.values(groupedData);
    },
  });
};

export const useGroupedSalesTransactionADMIN = () => {
  return useQuery({
    queryKey: ["groupedSalesTransaction"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select("*, id_products(name), id_branch(*)");

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        console.log("date HERE", date);
        console.log("itemSSS", item.id_branch.id_branch);
        const key = `${item.id_branch.id_branch}_${date}`;
        if (!acc[key]) {
          acc[key] = {
            id_group: item.id_group,
            id_products: item.id_products,
            id_branch: item.id_branch,
            quantity: 0,
            amount_by_product: 0,
            created_at: date,
            transactions: [],
            created_by: item.created_by,
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].transactions.push(item);

        return acc;
      }, {});
      return Object.values(groupedData);
    },
  });
};

export const useGroupedSalesTransactionReport = (id: string) => {
  return useQuery({
    queryKey: ["groupedSalesTransactionReport", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select("*, id_products(name)")
        .eq("id_branch", id);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const key = `${item.id_products}`;
        console.log("key", item.id_products);
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            amount_by_product: 0,
            // created_at: formattedDate,
            transactions: [],
          };
        }

        acc[key].amount_by_product += item.amount_by_product;
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useGroupedSalesReport = (id: string, date: Date) => {
  return useQuery({
    queryKey: [
      "groupedSalesTransactionReport",
      id,
      date.toISOString().split("T")[0],
    ],
    queryFn: async () => {
      const formattedDate = date.toISOString().split("T")[0];
      console.log("formattedDate", formattedDate);
      const { data, error } = await supabase
        .from("salestransaction")
        .select("*, id_products(*)")
        .eq("id_branch", id);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === formattedDate;
      });

      console.log("filteredData", filteredData);

      const groupedData = filteredData.reduce((acc, item) => {
        const key = `${item.id_products.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            amount_by_product: 0,
            created_at: formattedDate,
            transactions: [],
            created_by: item.created_by,
          };
        }
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useSalesTransactionById = (id: string) => {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select(`*, id_products(name), id_branch(place)`)
        .eq("id_group", id);
      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const key = item.id_products.name;
        if (!acc[key]) {
          acc[key] = {
            ...item,

            quantity: 0,
            transactions: [],
          };
        }

        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      const result = Object.values(groupedData).map((item: any) => ({
        ...item,
        amount: item.amount_by_product,
      }));

      return result;
    },
  });
};

export const useUserVoid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id_group: string }) => {
      try {
        const { data: transactions, error: transactionError } = await supabase
          .from("salestransaction")
          .select("*")
          .eq("id_group", data.id_group);
        console.log("transactions", transactions);

        if (transactionError) {
          throw new Error("Error fetching transactions");
        }

        for (const transaction of transactions) {
          console.log("Transaction:", transaction);

          const { data: localBatch, error: fetchError } = await supabase
            .from("localbatch")
            .select("quantity")
            .eq("id_localbranch", transaction.id_localbranch)
            .single();

          if (fetchError) {
            throw new Error(`Error fetching localbatch: ${fetchError.message}`);
          }

          const newQuantity = localBatch.quantity + transaction.quantity;
          const { data: updatedBatch, error: updateError } = await supabase
            .from("localbatch")
            .update({ quantity: newQuantity })
            .eq("id_localbranch", transaction.id_localbranch)
            .single();
          console.log("updatedBatch", updatedBatch);

          if (updateError) {
            throw new Error(
              `Error updating localbatch table: ${updateError.message}`
            );
          }

          const { data: productsData, error: productsDataError } =
            await supabase
              .from("products")
              .select("*")
              .eq("id_products", transaction.id_products)
              .single();

          if (productsDataError) {
            throw new Error(
              `Error fetching localbatch: ${productsDataError.message}`
            );
          }

          const newProductQuantity =
            productsData.quantity + transaction.quantity;
          const {
            data: updatedProductQuantity,
            error: updatedProductQuantityError,
          } = await supabase
            .from("products")
            .update({ quantity: newQuantity })
            .eq("id_products", transaction.id_products)
            .single();
          console.log("updatedProductQuantity", updatedProductQuantity);

          if (updatedProductQuantityError) {
            throw new Error(
              `Error updating localbatch table: ${updatedProductQuantityError.message}`
            );
          }

          const { error: voidInsertError } = await supabase
            .from("voidsalestransaction")
            .insert({
              // id_salestransaction: transaction.id_salestransaction,
              id_products: transaction.id_products,
              amount: transaction.amount,
              quantity: transaction.quantity,
              created_by: transaction.created_by,
              id_group: transaction.id_group,
              amount_by_product: transaction.amount_by_product,
              id_branch: transaction.id_branch,
            });

          if (voidInsertError) {
            throw new Error(
              `Error inserting into voidsalestransaction table: ${voidInsertError.message}`
            );
          }
        }

        const { error: deleteError } = await supabase
          .from("salestransaction")
          .delete()
          .eq("id_group", data.id_group);

        if (deleteError) {
          throw new Error(
            `Error deleting transactions: ${deleteError.message}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error voiding transactions:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      console.log("cancellll");
      await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
      await queryClient.invalidateQueries({ queryKey: ["salestransaction"] });
      await queryClient.invalidateQueries({
        queryKey: ["groupedSalesTransaction"],
      });
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

// export const useAllLocalBranchData = (id: string) => {
//   return useQuery({
//     queryKey: ["alllocalbatchdata", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("localbatch")
//         .select(`*, id_products(*, category(*))`)
//         .eq("id_branch", id);
//       if (error) {
//         throw new Error(error.message);
//       }
//       return data;
//     },
//   });
// };

export const useAllLocalBranchData = (id: string) => {
  return useQuery({
    queryKey: ["alllocalbatchdata", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("localbatch")
        .select(`*, id_localbranch, id_products(*)`)
        .eq("id_branch", id)
        .not("id_products", "is", null);
      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const productId = item.id_products.id_products;
        if (!acc[productId]) {
          acc[productId] = {
            ...item.id_products,
            quantity: 0,
            id_branch: item.id_branch,
            id_batch: item.id_batch,
            id_localbranch: item.id_localbranch,
          };
        }
        acc[productId].quantity += item.quantity;
        return acc;
      }, {});

      console.log("RETURNNN", groupedData);

      return Object.values(groupedData);
      // return data;
    },
  });
};

export const useInsertCashCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const { data: cashCount, error } = await supabase
          .from("cashcount")
          .insert({
            id_branch: data.id_branch,
            id_user: data.id_user,
            total: data.total,
            one: data.one,
            five: data.five,
            ten: data.ten,
            twenty: data.twenty,
            fifty: data.fifty,
            hundred: data.hundred,
            two_hundred: data.two_hundred,
            five_hundred: data.five_hundred,
            thousand: data.thousand,
          });

        if (error) {
          throw error;
        }

        return cashCount;
      } catch (error) {
        console.error("Error inserting cashcount:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cashcount"] });
    },
  });
};

export const getEmployeeUUID = (email: string) => {
  return useQuery({
    queryKey: ["UUID", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("email", email);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertPendingProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_branch: number;
      id_user: string;
      id_group: string;
    }) => {
      try {
        const { data: pendingproducts, error: pendingproductsError } =
          await supabase
            .from("localbatch")
            .select("*")
            .eq("id_branch", data.id_branch)
            .not("id_products", "is", null)
            .neq("quantity", 0);

        if (pendingproductsError) {
          throw new Error("Error fetching transactions");
        }

        console.log("Pending products:", pendingproducts);

        const insertedIds = [];

        for (const pendingproduct of pendingproducts) {
          console.log("Pending product:", pendingproduct);
          const { data: insertedProduct, error: pendingproductsError } =
            await supabase
              .from("pendingproducts")
              .insert({
                id_localbranch: pendingproduct.id_localbranch,
                id_user: data.id_user,
                id_group: data.id_group,
                id_branch: pendingproduct.id_branch,
                id_batch: pendingproduct.id_batch,
                id_products: pendingproduct.id_products,
                quantity: pendingproduct.quantity,
              })
              .select("id_products")
              .single();

          if (pendingproductsError) {
            throw new Error(
              `Error inserting into pendingproducts table: ${pendingproductsError.message}`
            );
          }

          insertedIds.push(insertedProduct.id_products);

          // const { error: deleteError } = await supabase
          //   .from("localbatch")
          //   .delete()
          //   .eq("id_localbranch", pendingproduct.id_localbranch);

          // if (deleteError) {
          //   throw new Error(
          //     `Error deleting from localbatch table: ${deleteError.message}`
          //   );
          // }
        }

        return insertedIds;
      } catch (error) {
        console.error("Error pending products:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log("Inserted IDs:", data);
      await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
      await queryClient.invalidateQueries({ queryKey: ["pendingproducts"] });
    },
  });
};

export const useFindPendingProducts = (id_branch: string) => {
  return useQuery({
    queryKey: ["findPendingProducts", id_branch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pendingproducts")
        .select(`*`)
        .eq("id_branch", id_branch);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useGetCashCount = (id_branch: string, date: string) => {
  return useQuery({
    queryKey: ["cashcount", id_branch, date],
    queryFn: async () => {
      const { data, error } = await supabase.from("cashcount").select(`*`);
      if (error) {
        throw new Error(error.message);
      }

      const cashCountDate = data.map((item) => {
        return new Date(item.created_at).toISOString().split("T")[0];
      });

      console.log("RETURN date2?", cashCountDate);

      if (cashCountDate?.includes(date)) {
        console.log("IT MATCHES THE DATE AND CASHCOUNTDATE", date);
        //2024-11-25
        const { data: cashCountOfTheDay, error: cashCountOfTheDayError } =
          await supabase
            .from("cashcount")
            .select(`*`)
            .eq("id_branch", id_branch)
            .gte("created_at", `${date}T00:00:00.000Z`)
            .lt("created_at", `${date}T23:59:59.999Z`);
        if (cashCountOfTheDayError) {
          throw new Error(cashCountOfTheDayError.message);
        }

        const DATA = cashCountOfTheDay !== undefined ? cashCountOfTheDay : [];

        return cashCountOfTheDay;
      }
    },
  });
};

export const use = (idB: string) => {
  return useQuery({
    queryKey: ["salesTrans", idB],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select(`*, id_products(*)`)
        .eq("id_branch", idB);

      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const groupId = item.id_group;
        if (!acc[groupId]) {
          acc[groupId] = { amount: 0, created_at: item.created_at };
        }
        acc[groupId].amount += item.amount;
        return acc;
      }, {});

      console.log("DUUNOO", groupedData);

      return Object.values(groupedData);
    },
  });
};

// export const useGetVoidedTransaction = () => {
//   return useQuery({
//     queryKey: ["void"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("voidsalestransaction")
//         .select(`*`);
//       if (error) {
//         throw new Error(error.message);
//       }
//       return data;
//     },
//   });
// };

export const useGetVoidedTransaction = (id: string, date: Date) => {
  return useQuery({
    queryKey: [
      "groupedVoidedTransactionReport",
      id,
      date.toISOString().split("T")[0],
    ], // Ensure queryKey is stable
    queryFn: async () => {
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      console.log("formattedDate", formattedDate);
      const { data, error } = await supabase
        .from("voidsalestransaction")
        .select("*, id_products(*)")
        .eq("id_branch", id);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === formattedDate;
      });

      console.log("filteredData", filteredData);

      const groupedData = filteredData.reduce((acc, item) => {
        const key = `${item.id_products.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            amount_by_product: 0,
            created_at: formattedDate,
            transactions: [],
          };
        }
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useGetVoidedTransactionADMIN = (
  id_branch: string,
  date: string
) => {
  return useQuery({
    queryKey: ["groupedVoidedTransactionReport", id_branch, date], // Ensure queryKey is stable
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voidsalestransaction")
        .select("*, id_products(*)")
        .eq("id_branch", id_branch);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === date;
      });

      console.log("filteredData", filteredData);

      const groupedData = filteredData.reduce((acc, item) => {
        const key = `${item.id_products.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            amount_by_product: 0,
            created_at: date,
            transactions: [],
          };
        }
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useDeleteLocalBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id_branch: number }) => {
      try {
        const { data: pendingproducts, error: pendingproductsError } =
          await supabase
            .from("pendingproducts")
            .select("*")
            .eq("id_branch", data.id_branch);

        if (pendingproductsError) {
          throw new Error("Error fetching transactions");
        }

        console.log("Pending products:", pendingproducts);

        const newIDgroup = uuid.v4();
        console.log("newIDgroup+++_)_", newIDgroup);

        const promises = pendingproducts.map(async (pendingproduct) => {
          const confirmedProduct = {
            id_products: pendingproduct.id_products,
            id_batch: pendingproduct.id_batch,
            quantity: pendingproduct.quantity,
            id_user: pendingproduct.id_user,
            id_branch: pendingproduct.id_branch,
            id_group: pendingproduct.id_group,
            returned_groupID: newIDgroup,
          };

          // Insert into confirmedproducts table
          const { data: insertedProduct, error: insertConfirmedError } =
            await supabase
              .from("confirmedproducts")
              .insert(confirmedProduct)
              .select("id_products")
              .single();

          if (insertConfirmedError) {
            throw new Error(
              `Error inserting into confirmedproducts table: ${insertConfirmedError.message}`
            );
          }

          // Delete from pendingproducts and localbatch tables in parallel
          const deletePendingPromise = supabase
            .from("pendingproducts")
            .delete()
            .eq("id_group", pendingproduct.id_group);
          // .eq("id_localbranch", pendingproduct.id_localbranch)
          // .eq("id_products", pendingproduct.id_products)
          // .eq("id_batch", pendingproduct.id_batch)
          // .eq("quantity", pendingproduct.quantity);

          const deleteLocalBatchPromise = supabase
            .from("localbatch")
            .delete()
            .eq("id_localbranch", pendingproduct.id_localbranch)
            .eq("id_products", pendingproduct.id_products)
            .eq("id_batch", pendingproduct.id_batch)
            .eq("quantity", pendingproduct.quantity);

          await Promise.all([deletePendingPromise, deleteLocalBatchPromise]);

          return insertedProduct.id_products;
        });

        const insertedIds = await Promise.all(promises);
        return insertedIds;
      } catch (error) {
        console.error("Error processing pending products:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log("Inserted IDs:", data);
      await queryClient.invalidateQueries({
        queryKey: ["localbatch", "pendingproducts", "transaferPendingProducts"],
      });
    },
  });
};

export const useGetPendingProducts = () => {
  return useQuery({
    queryKey: ["transaferPendingProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confirmedproducts")
        .select(`*, id_branch(*)`);
      if (error) {
        throw new Error(error.message);
      }

      const groupedData = data.reduce((acc, item) => {
        const groupId = `${item.returned_groupID}_${item.id_branch}`;
        if (!acc[groupId]) {
          acc[groupId] = {
            id_branch_place: item.id_branch.place,
            created_at: item.created_at,
            id_branch: item.id_branch,
          };
        }

        return acc;
      }, {});

      console.log("DUUNOO", groupedData);

      return Object.values(groupedData);
    },
  });
};

export const useGetPendingProductsDetails = (id_branch: string) => {
  return useQuery({
    queryKey: ["transaferPendingProductss", id_branch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confirmedproducts")
        .select(`*, id_branch(*), id_products(*), id_batch(expire_date)`)
        .eq("id_branch", id_branch);
      if (error) {
        throw new Error(error.message);
      }

      const combinedData = data.reduce((acc, item) => {
        const key = `${item.id_products.id_products}`;
        console.log("keyRETURNED", key);
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            expire_date: item.id_batch.expire_date,
            id_branch: item.id_branch,
          };
        }
        acc[key].quantity += item.quantity;
        return acc;
      }, {});

      return Object.values(combinedData);
    },
  });
};

export const useGetPendingProductsDetailsById = (
  id_branch: string,
  id_products: number
) => {
  return useQuery({
    queryKey: ["transaferPendingProductss", id_branch, id_products],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confirmedproducts")
        .select(`*, id_branch(place), id_products(name), id_batch(expire_date)`)
        .eq("id_branch", id_branch)
        .eq("id_products", id_products);
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useTransferReturnedBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id_branch: number; newId_branch: number }) => {
      console.log("PLSSSS||||", data.newId_branch);
      try {
        const { data: pendingproducts, error: pendingproductsError } =
          await supabase
            .from("confirmedproducts")
            .select(
              "*,id_branch(place) ,id_batch(*), id_products(*, id_price(amount))"
            )
            .eq("id_branch", data.newId_branch);

        if (pendingproductsError) {
          throw new Error("Error fetching transactions");
        }

        console.log("Pending products:", pendingproducts);

        const dateNow = new Date();
        const yearNOW = dateNow.getFullYear();
        const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
        const dayNOW = String(dateNow.getDate()).padStart(2, "0");
        const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;
        console.log("Current Date!!", currentDate);

        const promises = pendingproducts.map(async (pendingproduct) => {
          const expireDate = pendingproduct.id_batch.expire_date;

          if (expireDate === currentDate) {
            const expiredIdBranch = pendingproduct.id_batch;
            const potentialSales =
              pendingproduct.quantity *
              pendingproduct.id_products.id_price.amount;
            const totalQuantity = pendingproduct.quantity;
            const currentProduct = pendingproduct.id_products.id_products;

            const expiredProduct = {
              id_products: pendingproduct.id_products.id_products,
              quantity: pendingproduct.quantity,
              expire_date: expireDate,
              potential_sales: potentialSales,
            };

            const { data: insertedExpiredProduct, error: insertExpiredError } =
              await supabase
                .from("expiredproducts")
                .insert(expiredProduct)
                .select("id_products")
                .single();

            if (insertExpiredError) {
              throw new Error(
                `Error inserting into expireTransaction table: ${insertExpiredError.message}`
              );
            }

            const { data: productsData, error: productsDataError } =
              await supabase
                .from("products")
                .select("*")
                .eq("id_products", currentProduct)
                .single();

            const { data: updateProductsData, error: updateProductsDataError } =
              await supabase
                .from("products")
                .update({ quantity: productsData.quantity - totalQuantity })
                .eq("id_products", currentProduct)
                .single();

            const deleteBatch = supabase
              .from("batch")
              .delete()
              .eq("id_batch", expiredIdBranch);

            const deletePending = supabase
              .from("confirmedproducts")
              .delete()
              .eq("id_batch", expiredIdBranch);
            await Promise.all([deletePending]);

            return insertedExpiredProduct.id_products.id_products;
          }

          const confirmedProduct = {
            id_products: pendingproduct.id_products.id_products,
            id_batch: pendingproduct.id_batch.id_batch,
            quantity: pendingproduct.quantity,
            id_branch: data.id_branch,
            before: pendingproduct.quantity,
          };

          const { data: branch } = await supabase
            .from("branch")
            .select("place")
            .eq("id_branch", data.id_branch);

          console.log("EYYEOW?", branch);
          const place = branch?.[0]?.place;

          const returnedProduct = {
            id_products: pendingproduct.id_products.id_products,
            from: pendingproduct.id_branch.place,
            to: place,
            quantity: pendingproduct.quantity,
          };

          const {
            data: transferReturnedHistory,
            error: transferReturnedHistoryError,
          } = await supabase
            .from("returnedproductstransaction")
            .insert(returnedProduct)
            .single();

          if (transferReturnedHistoryError) {
            throw new Error(
              `Error inserting into confirmedproducts table: ${transferReturnedHistoryError.message}`
            );
          }

          const { data: insertedProduct, error: insertConfirmedError } =
            await supabase
              .from("localbatch")
              .insert(confirmedProduct)
              .select("id_products")
              .single();

          if (insertConfirmedError) {
            throw new Error(
              `Error inserting into confirmedproducts table+: ${insertConfirmedError.message}`
            );
          }

          const deletePendingPromise = supabase
            .from("confirmedproducts")
            .delete()
            .eq("returned_groupID", pendingproduct.returned_groupID);
          await Promise.all([deletePendingPromise]);

          return insertedProduct.id_products.id_products;
        });

        const insertedIds = await Promise.all(promises);
        return insertedIds;
      } catch (error) {
        console.error("Error processing pending productss:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log("Inserted IDs:", data);
      await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
      await queryClient.invalidateQueries({ queryKey: ["pendingproducts"] });
      await queryClient.invalidateQueries({ queryKey: ["confirmedproducts"] });
      await queryClient.invalidateQueries({
        queryKey: ["transaferPendingProducts"],
      });
    },
  });
};

export const useReturnedBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { newId_branch: number }) => {
      console.log("PLSSSS||||", data.newId_branch);
      try {
        const { data: pendingproducts, error: pendingproductsError } =
          await supabase
            .from("confirmedproducts")
            .select(
              "*,id_branch(place), id_batch(*), id_products(*, id_price(amount))"
            )
            .eq("id_branch", data.newId_branch);

        if (pendingproductsError) {
          throw new Error("Error fetching transactions");
        }

        console.log("Pending products:", pendingproducts);

        const dateNow = new Date();
        const yearNOW = dateNow.getFullYear();
        const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
        const dayNOW = String(dateNow.getDate()).padStart(2, "0");
        const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;
        console.log("Current Date!!", currentDate);

        const promises = pendingproducts.map(async (pendingproduct) => {
          const expireDate = pendingproduct.id_batch.expire_date;

          if (expireDate === currentDate) {
            const expiredIdBranch = pendingproduct.id_batch;
            const potentialSales =
              pendingproduct.quantity *
              pendingproduct.id_products.id_price.amount;
            const totalQuantity = pendingproduct.quantity;
            const currentProduct = pendingproduct.id_products.id_products;

            const expiredProduct = {
              id_products: pendingproduct.id_products.id_products,
              quantity: pendingproduct.quantity,
              expire_date: expireDate,
              potential_sales: potentialSales,
            };

            const { data: insertedExpiredProduct, error: insertExpiredError } =
              await supabase
                .from("expiredproducts")
                .insert(expiredProduct)
                .select("id_products")
                .single();

            if (insertExpiredError) {
              throw new Error(
                `Error inserting into expireTransaction table: ${insertExpiredError.message}`
              );
            }

            const { data: productsData, error: productsDataError } =
              await supabase
                .from("products")
                .select("*")
                .eq("id_products", currentProduct)
                .single();

            const { data: updateProductsData, error: updateProductsDataError } =
              await supabase
                .from("products")
                .update({ quantity: productsData.quantity - totalQuantity })
                .eq("id_products", currentProduct)
                .single();

            const deletePending = supabase
              .from("confirmedproducts")
              .delete()
              .eq("id_batch", expiredIdBranch);
            await Promise.all([deletePending]);

            return insertedExpiredProduct.id_products.id_products;
          }

          const confirmedProduct = {
            id_products: pendingproduct.id_products.id_products,
            quantity: pendingproduct.quantity,
          };

          const returnedProduct = {
            id_products: pendingproduct.id_products.id_products,
            from: pendingproduct.id_branch.place,
            to: "Back Inventory",
            quantity: pendingproduct.quantity,
          };

          const {
            data: transferReturnedHistory,
            error: transferReturnedHistoryError,
          } = await supabase
            .from("returnedproductstransaction")
            .insert(returnedProduct)
            .single();

          if (transferReturnedHistoryError) {
            throw new Error(
              `Error inserting into returnedproductstransaction table: ${transferReturnedHistoryError.message}`
            );
          }

          console.log("YWODSJ", pendingproduct.id_batch);
          console.log("YWODSJs", pendingproduct.quantity);

          if (typeof pendingproduct.quantity === "object") {
            for (const key in pendingproduct.quantity) {
              if (pendingproduct.quantity.hasOwnProperty(key)) {
                const quantityValue = pendingproduct.quantity[key];
                console.log("YWODSJ", pendingproduct.id_batch);
                console.log("YWODSJs", quantityValue);

                const { data: batchQuantityData, error: batchQuantityError } =
                  await supabase
                    .from("batch")
                    .select("*")
                    .eq("id_batch", pendingproduct.id_batch.id_batch)
                    .single();

                console.log("batchQuantityData QUANIRYT", batchQuantityData);
                if (batchQuantityError) {
                  throw new Error(
                    `Error fetching from batch table: ${batchQuantityError.message}`
                  );
                }

                const { data: updatedBatch, error: updateBatchError } =
                  await supabase
                    .from("batch")
                    .update({
                      quantity: batchQuantityData.quantity + quantityValue,
                    })
                    .eq("id_batch", pendingproduct.id_batch.id_batch)
                    .select("id_products")
                    .single();

                if (updateBatchError) {
                  throw new Error(
                    `Error updating batch table: ${updateBatchError.message}`
                  );
                }

                console.log("Updated Batch", updatedBatch);

                const deletePendingPromise = supabase
                  .from("confirmedproducts")
                  .delete()
                  .eq("id_group", pendingproduct.id_group);
                await Promise.all([deletePendingPromise]);

                return updatedBatch.id_products.id_products;
              }
            }
          } else {
            const { data: batchQuantityData, error: batchQuantityError } =
              await supabase
                .from("batch")
                .select("*")
                .eq("id_batch", pendingproduct.id_batch.id_batch)
                .single();

            console.log("batchQuantityData QUANIRYT", batchQuantityData);
            if (batchQuantityError) {
              throw new Error(
                `Error fetching from batch table: ${batchQuantityError.message}`
              );
            }

            const { data: updatedBatch, error: updateBatchError } =
              await supabase
                .from("batch")
                .update({
                  quantity:
                    batchQuantityData.quantity + pendingproduct.quantity,
                })
                .eq("id_batch", pendingproduct.id_batch.id_batch)
                .select("id_products")
                .single();

            if (updateBatchError) {
              throw new Error(
                `Error updating batch table: ${updateBatchError.message}`
              );
            }

            console.log("Updated Batch", updatedBatch);

            const deletePendingPromise = supabase
              .from("confirmedproducts")
              .delete()
              .eq("id_group", pendingproduct.id_group);
            await Promise.all([deletePendingPromise]);

            return updatedBatch.id_products.id_products;
          }
        });

        const insertedIds = await Promise.all(promises);
        return insertedIds;
      } catch (error) {
        console.error("Error processing pending products:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log("Inserted IDs:", data);
      await queryClient.invalidateQueries({ queryKey: ["localbatch"] });
      await queryClient.invalidateQueries({ queryKey: ["pendingproducts"] });
      await queryClient.invalidateQueries({ queryKey: ["confirmedproducts"] });
      await queryClient.invalidateQueries({
        queryKey: ["transaferPendingProducts"],
      });
    },
  });
};

export const useGetTotalSalesReport = (id_branch: string, date: string) => {
  return useQuery({
    queryKey: ["useGetTotalSalesReport", id_branch, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salestransaction")
        .select(`*, id_branch(place), id_products(*)`)
        .eq("id_branch", id_branch);

      if (error) {
        throw new Error(error.message);
      }

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === date;
      });

      const groupedData = filteredData.reduce((acc, item) => {
        const key = `${item.id_products.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            amount_by_product: 0,
            created_at: date,
            transactions: [],
            created_by: item.created_by,
          };
        }
        acc[key].amount_by_product += item.amount_by_product;
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);
        return acc;
      }, {});

      console.log("groupedData", groupedData);

      return Object.values(groupedData);
    },
  });
};

// export const useSalesReportADMIN = (id: string, date: string) => {
//   return useQuery({
//     queryKey: [
//       "useSalesReportADMIN",
//       id,
//       date,
//     ],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("salestransaction")
//         .select("*, id_products(*)")
//         .eq("id_branch", id);

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (data.length === 0) {
//         return [];
//       }

//       const filteredData = data.filter((item) => {
//         const itemDate = new Date(item.created_at).toISOString().split("T")[0];
//         return itemDate === formattedDate;
//       });

//       console.log("filteredData", filteredData);

//       const groupedData = filteredData.reduce((acc, item) => {
//         const key = `${item.id_products.id_products}`;
//         if (!acc[key]) {
//           acc[key] = {
//             id_products: item.id_products,
//             quantity: 0,
//             amount_by_product: 0,
//             created_at: formattedDate,
//             transactions: [],
//             created_by: item.created_by,
//           };
//         }
//         acc[key].amount_by_product += item.amount_by_product;
//         acc[key].quantity += item.quantity;
//         acc[key].transactions.push(item);
//         return acc;
//       }, {});

//       return Object.values(groupedData);
//     },
//   });
// };

export const useOverviewProductList = () => {
  return useQuery({
    queryKey: ["useOverviewProductList"],
    queryFn: async () => {
      try {
        const [
          { data: productsTable, error: productsTableError },
          { data: batchTable, error: batchTableError },
          { data: localBatchTable, error: localBatchTableError },
          { data: confirmedProductTable, error: confirmedProductTableError },
          { data: pendinglocalbatchTable, error: pendinglocalbatchTableError },
        ] = await Promise.all([
          supabase
            .from("products")
            .select(`id_products, name`)
            .eq("id_archive", 2),
          supabase.from("batch").select(`id_products, quantity`),
          supabase
            .from("localbatch")
            .select(`id_branch(place), id_products, quantity`),
          supabase
            .from("confirmedproducts")
            .select(`id_branch(place), id_products, quantity`),
          supabase
            .from("pendinglocalbatch")
            .select(`id_branch(place), id_products, quantity`),
        ]);

        if (productsTableError) {
          throw new Error(productsTableError.message);
        }
        if (batchTableError) {
          throw new Error(batchTableError.message);
        }
        if (localBatchTableError) {
          throw new Error(localBatchTableError.message);
        }
        if (confirmedProductTableError) {
          throw new Error(confirmedProductTableError.message);
        }
        if (pendinglocalbatchTableError) {
          throw new Error(pendinglocalbatchTableError.message);
        }

        console.log("productsTable", productsTable);
        console.log("batchTable", batchTable);
        console.log("localBatchTable", localBatchTable);
        console.log("confirmedProductTable", confirmedProductTable);
        console.log("pendinglocalbatchTable", pendinglocalbatchTable);

        const groupedLocalBatchTable = localBatchTable.reduce(
          (acc: any, item: any) => {
            const key = item.id_products;
            if (!acc[key]) {
              acc[key] = {
                id_products: item.id_products,
                places: {},
                totalQuantity: 0,
              };
            }

            console.log("item.id_branch.place", item.id_branch.place);
            const placeKey = item.id_branch.place;
            if (!acc[key].places[placeKey]) {
              acc[key].places[placeKey] = 0;
            }
            acc[key].places[placeKey] += item.quantity;
            acc[key].totalQuantity += item.quantity;

            return acc;
          },
          {}
        );

        console.log("groupedLocalBatchTable HEREERR", groupedLocalBatchTable);
        console.log(
          "groupedLocalBatchTable HEREERR",
          Object.values(groupedLocalBatchTable)
        );

        const combinedData = productsTable.map((product) => {
          const batchData = batchTable.filter(
            (item) => item.id_products === product.id_products
          );

          console.log("batchData1", batchData);

          const localBatchData = localBatchTable.filter(
            (item: any) => item.id_products === product.id_products
          );

          // const localBatchGrouped = groupedLocalBatchTable.reduce(
          //   (acc: any, item: any) => {
          //     const place = item.id_branch.place;
          //     acc.totalQuantity += item.quantity;
          //     acc.places[place] = (acc.places[place] || 0) + item.quantity;
          //     return acc;
          //   },
          //   { places: {}, totalQuantity: 0 } // Initialize accumulator
          // );

          // console.log("localBatchData!!!!", localBatchData);
          // console.log("????????????!!!!", localBatchGrouped);

          const confirmedProductData: any = confirmedProductTable.filter(
            (item) => item.id_products === product.id_products
          );
          const pendingLocalBatchData: any = pendinglocalbatchTable.filter(
            (item) => item.id_products === product.id_products
          );

          const totalQuantity =
            batchData.reduce((sum, item) => sum + item.quantity, 0) +
            localBatchData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            ) +
            confirmedProductData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            ) +
            pendingLocalBatchData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            );

          console.log("batchData", batchData);
          // console.log("localBatchData", localBatchData);
          console.log("confirmedProductData", confirmedProductData);
          console.log("pendingLocalBatchData", pendingLocalBatchData);
          // console.log("????????", localBatchData.length);
          // console.log(groupedLocalBatchTable.map(
          //   (item: any) => item.id_branch.place
          // ));

          console.log(
            ")+++++++",
            Object.values(groupedLocalBatchTable).map(
              (item: any) => item.places
            )
          );

          return {
            ...product,
            totalQuantity,
            batch: batchData.length
              ? {
                  quantity: batchData.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ),
                }
              : null,

            localBatch: localBatchData.length
              ? {
                  place: localBatchData[0].id_branch,
                  quantity: localBatchData.reduce(
                    (sum: any, item: { quantity: any }) => sum + item.quantity,
                    0
                  ),
                }
              : null,

            confirmedProduct: confirmedProductData.length
              ? {
                  place: confirmedProductData[0].id_branch.place,
                  quantity: confirmedProductData.reduce(
                    (sum: any, item: { quantity: any }) => sum + item.quantity,
                    0
                  ),
                }
              : null,
            pendingLocalBatch: pendingLocalBatchData.length
              ? {
                  place: pendingLocalBatchData[0].id_branch.place,
                  quantity: pendingLocalBatchData.reduce(
                    (sum: any, item: { quantity: any }) => sum + item.quantity,
                    0
                  ),
                }
              : null,
          };
        });

        return combinedData;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
  });
};

export const useOverviewProductListById = (id_products: string) => {
  return useQuery({
    queryKey: ["useOverviewProductList", id_products],
    queryFn: async () => {
      try {
        const [
          { data: productsTable, error: productsTableError },
          { data: batchTable, error: batchTableError },
          { data: localBatchTable, error: localBatchTableError },
          { data: confirmedProductTable, error: confirmedProductTableError },
          { data: pendinglocalbatchTable, error: pendinglocalbatchTableError },
        ] = await Promise.all([
          supabase
            .from("products")
            .select(`id_products, name`)
            .eq("id_products", id_products),
          supabase
            .from("batch")
            .select(`id_products, quantity`)
            .eq("id_products", id_products),
          supabase
            .from("localbatch")
            .select(`id_branch(place), id_products, quantity`)
            .eq("id_products", id_products),
          supabase
            .from("confirmedproducts")
            .select(`id_branch(place), id_products, quantity`)
            .eq("id_products", id_products),
          supabase
            .from("pendinglocalbatch")
            .select(`id_branch(place), id_products, quantity`)
            .eq("id_products", id_products),
        ]);

        if (productsTableError) {
          throw new Error(productsTableError.message);
        }
        if (batchTableError) {
          throw new Error(batchTableError.message);
        }
        if (localBatchTableError) {
          throw new Error(localBatchTableError.message);
        }
        if (confirmedProductTableError) {
          throw new Error(confirmedProductTableError.message);
        }
        if (pendinglocalbatchTableError) {
          throw new Error(pendinglocalbatchTableError.message);
        }

        console.log("productsTable", productsTable);
        console.log("batchTable", batchTable);
        console.log("localBatchTable", localBatchTable);
        console.log("confirmedProductTable", confirmedProductTable);
        console.log("pendinglocalbatchTable", pendinglocalbatchTable);

        const combinedData = productsTable?.map((product) => {
          const batchData = batchTable?.filter(
            (item) => item.id_products === product.id_products
          );
          const localBatchData: any = localBatchTable?.filter(
            (item) => item.id_products === product.id_products
          );
          const confirmedProductData: any = confirmedProductTable?.filter(
            (item) => item.id_products === product.id_products
          );
          const pendingLocalBatchData: any = pendinglocalbatchTable?.filter(
            (item) => item.id_products === product.id_products
          );

          const totalQuantity =
            batchData?.reduce((sum, item) => sum + item.quantity, 0) +
            localBatchData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            ) +
            confirmedProductData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            ) +
            pendingLocalBatchData.reduce(
              (sum: any, item: { quantity: any }) => sum + item.quantity,
              0
            );

          console.log("batchData", batchData);
          console.log("localBatchData", localBatchData);
          console.log("confirmedProductData", confirmedProductData);
          console.log("pendingLocalBatchData", pendingLocalBatchData);

          const localBatchDataItems = localBatchData?.map((item: any) => {
            return {
              place: item.id_branch.place,
              quantity: item.quantity,
            };
          });

          console.log("LOCAL BATCH DATA ITEMS MODAL", localBatchDataItems);

          return {
            ...product,
            totalQuantity,
            batch: batchData?.length
              ? {
                  quantity: batchData?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ),
                }
              : null,
            localBatch: localBatchData.length ? localBatchDataItems : null,
            confirmedProduct: confirmedProductData.length
              ? {
                  place: confirmedProductData[0].id_branch.place,
                  quantity: confirmedProductData.reduce(
                    (sum: any, item: { quantity: any }) => sum + item.quantity,
                    0
                  ),
                }
              : null,
            pendingLocalBatch: pendingLocalBatchData.length
              ? {
                  place: pendingLocalBatchData[0].id_branch.place,
                  quantity: pendingLocalBatchData.reduce(
                    (sum: any, item: { quantity: any }) => sum + item.quantity,
                    0
                  ),
                }
              : null,
          };
        });

        console.log("COMBINED DATA", combinedData);
        return combinedData;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
  });
};

export const useInsertProductionHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      location: string;
      id_products: string;
      quantity: number;
    }) => {
      try {
        const { data: insertedProduct, error: pendingproductsError } =
          await supabase.from("stockmovement").insert({
            location: data.location,
            id_products: data.id_products,
            quantity: data.quantity,
          });
        // .select("id_products")
        // .single();

        if (pendingproductsError) {
          throw new Error(
            `Error inserting into stockmovement table: ${pendingproductsError.message}`
          );
        }

        return insertedProduct;
      } catch (error) {
        console.error("Error inserting product:", error);
        throw error;
      }
    },
  });
};

export const useGetProductionHistory = () => {
  return useQuery({
    queryKey: ["groupedProductionHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stockmovement")
        .select("*, id_products(name)");

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        if (item.location === "Back Inventory") {
          return acc;
        }

        const date = new Date(item.created_at).toISOString().split("T")[0];
        const key = `${item.location}_${date}`;
        console.log("keyjsajjs", key);
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            location: item.location,
            quantity: 0,
            created_at: date,
            transactions: [],
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);

        return acc;
      }, {});
      return Object.values(groupedData);
    },
  });
};

export const useGetProductionHistoryByLocation = () => {
  return useQuery({
    queryKey: ["groupedProductionHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stockmovement")
        .select("*, id_products(name)");

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        const key = `${item.location}_${date}`;
        console.log("keyjsajjs", key);
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            location: item.location,
            quantity: 0,

            created_at: date,
            transactions: [],
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);

        return acc;
      }, {});
      return Object.values(groupedData);
    },
  });
};

export const useGetProductionHistoryDetails = (
  location: string,
  date: string
) => {
  return useQuery({
    queryKey: ["groupedProductionHistory", location, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stockmovement")
        .select("*, id_products(name)")
        .eq("location", location);

      console.log("stockmovement", data);
      console.log("stockmovement date", date);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        if (itemDate !== date) {
          return acc;
        }

        const key = `${item.id_products.name}_${itemDate}`;

        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            created_at: item.created_at,
            transactions: [],
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);

        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useArchiveLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id_branch: number) {
      const { data: confirmStatus, error: errorStatus } = await supabase
        .from("branch")
        .select("*")
        .eq("id_branch", id_branch)
        .single();

      if (confirmStatus?.id_archives === 2) {
        const { data, error } = await supabase
          .from("branch")
          .update({ id_archives: 1 })
          .eq("id_branch", id_branch);

        console.log("id_branch", id_branch);
        if (error) {
          throw new Error(error.message);
        }
      }

      if (confirmStatus?.id_archives === 1) {
        const { data, error } = await supabase
          .from("branch")
          .update({ id_archives: 2 })
          .eq("id_branch", id_branch);

        console.log("id_branch", id_branch);
        if (error) {
          throw new Error(error.message);
        }
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["branch", "all"] });
    },
  });
};

export const useWarningByBranch = (id_branch: number) => {
  console.log("ID BRANCH|||", id_branch);
  return useQuery({
    queryKey: ["useWarningByBranch", id_branch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confirmedproducts")
        .select("quantity, id_products( name), id_batch( expire_date)")
        .eq("id_branch", id_branch)
        .neq("quantity", 0);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useExpiredProductsHistoru = () => {
  return useQuery({
    queryKey: ["useExpiredProductsHistoru"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expiredproducts")
        .select("*, id_products(name))");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProductsQuantity = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdateBatchQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      location,
      quantity,
      originalQuantity,
      id_products,
    }: {
      id: string;
      location: string;
      quantity: number;
      originalQuantity: number;
      id_products: number;
    }) => {
      console.log("ID", id);
      console.log("LOCATION", location);
      console.log("QUANTITY", quantity);
      console.log("ORIGINAL QUANTITY", originalQuantity);
      console.log("ID PRODUCTS", id_products);

      const dateNow = new Date();
      const yearNOW = dateNow.getFullYear();
      const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
      const dayNOW = String(dateNow.getDate()).padStart(2, "0");
      const dateExpired = `${yearNOW}-${monthNOW}-${dayNOW}`;
      console.log("Current Date DISPLAY:", dateExpired);

      const { data: productData, error: productDataError } = await supabase
        .from("products")
        .select("*, id_price(amount)")
        .eq("id_products", id_products)
        .single();

      if (productDataError) {
        throw new Error(productDataError.message);
      }

      console.log("productData----", productData);

      const updateBatch = async () => {
        if (location === "Back Inventory") {
          const { data, error } = await supabase
            .from("batch")
            .update({ quantity })
            .eq("id_batch", id);

          if (error) {
            throw new Error(error.message);
          }
          return data;
        } else if (location === "Returned Products") {
          const { data, error } = await supabase
            .from("confirmedproducts")
            .update({ quantity })
            .eq("id_confirmpendingproducts", id);

          if (error) {
            throw new Error(error.message);
          }
          return data;
        } else if (location === "Pending") {
          const { data, error } = await supabase
            .from("pendinglocalbatch")
            .update({ quantity })
            .eq("id_pendinglocalbranch", id);

          if (error) {
            throw new Error(error.message);
          }
          return data;
        } else {
          throw new Error("Invalid location specified");
        }
      };

      const newQuantity = originalQuantity - quantity;
      const insertExpiredProducts = async () => {
        const { data, error } = await supabase.from("expiredproducts").insert({
          id_products: id_products,
          quantity: newQuantity,
          expire_date: dateExpired,
          potential_sales: newQuantity * productData.id_price.amount,
        });

        if (error) {
          throw new Error(error.message);
        }
        return data;
      };

      const [updateResultData, expiredProductsData] = await Promise.all([
        updateBatch(),
        insertExpiredProducts(),
      ]);

      return updateResultData;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "branch",
          "all",
          " id_products",
          "batch",
          "batches",
          "localbatch",
          "id_products",
          "products",
          "backInventory",
          "setBatch",
          "useExpiredProductsHistoru",
        ],
      });
    },
  });
};

export const useGetRealProductionHistoryDetails = (
  location: string,
  date: string
) => {
  return useQuery({
    queryKey: ["groupedProductionHistory", location, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stockmovement")
        .select("*, id_products(name)")
        .eq("location", location);

      console.log("stockmovement", data);
      console.log("stockmovement date", date);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        return [];
      }

      const groupedData = data.reduce((acc, item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        if (itemDate !== date) {
          return acc;
        }

        const key = `${item.id_products.name}_${itemDate}`;

        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
            created_at: item.created_at,
            transactions: [],
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);

        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useInsertInitialCashBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cash: number;
      id_branch: string | string[];
    }) => {
      try {
        const { data: insertCashBalance, error: insertCashBalanceError } =
          await supabase.from("initialcashcount").insert({
            cash: data.cash,
            id_branch: data.id_branch,
          });
        // .single();

        if (insertCashBalanceError) {
          throw new Error(
            `Error inserting into initialcashcount table: ${insertCashBalanceError.message}`
          );
        }

        return insertCashBalance;
      } catch (error) {
        console.error("Error inserting product:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "branch",
          "all",
          "batch",
          "batches",
          "localbatch",
          "id_products",
          "products",
          "backInventory",
          "setBatch",
          "useExpiredProductsHistoru",
          "initialcashcount",
        ],
      });
    },
  });
};

export const useGetInitialCashCount = () => {
  return useQuery({
    queryKey: ["initialcashcount"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initialcashcount")
        .select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useReturnedProductHistory = () => {
  return useQuery({
    queryKey: ["returnedProductHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("returnedproductstransaction")
        .select("*");

      const groupedData = data?.reduce((acc, item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        const key = `${item.from}_${itemDate}`;
        console.log("keyjsajjs", key);

        if (!acc[key]) {
          acc[key] = {
            from: item.from,
            to: item.to,
            quantity: 0,
            transactions: [],
            created_at: itemDate,
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].transactions.push(item);

        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useReturnedProductHistoryDetails = (
  from: string | string[],
  date: string
) => {
  return useQuery({
    queryKey: ["returnedProductHistory", from, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("returnedproductstransaction")
        .select("*, id_products(name)");

      if (error) {
        throw new Error(error.message);
      }

      const filteredData = data?.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === date && item.from === from;
      });

      const groupedData = filteredData.reduce((acc, item) => {
        const key = `${item.id_products}`;
        if (!acc[key]) {
          acc[key] = {
            id_products: item.id_products,
            quantity: 0,
          };
        }
        acc[key].quantity += item.quantity;
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });
};

export const useCategory = () => {
  return useQuery({
    queryKey: ["useCategory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id_category");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useCategoryForProductTransfer = () => {
  return useQuery({
    queryKey: ["useCategoryForProductTransfer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batch")
        .select("id_products(id_category)");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      id_branch: string | "";
      type: string;
    }) => {
      try {
        const { data: insertNotification, error: insertNotificationError } =
          await supabase.from("notification").insert({
            title: data.title,
            body: data.body,
            isRead: false,
            id_branch: data.id_branch,
            type: data.type,
          });
        // .single();

        if (insertNotificationError) {
          throw new Error(
            `Error inserting into initialcashcount table: ${insertNotificationError.message}`
          );
        }

        return insertNotification;
      } catch (error) {
        console.error("Error inserting product:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "branch",
          "all",
          "batch",
          "batches",
          "localbatch",
          "id_products",
          "products",
          "backInventory",
          "setBatch",
          "useExpiredProductsHistoru",
          "initialcashcount",
          "useGetNotification",
        ],
      });
    },
  });
};

export const useGetNotification = () => {
  return useQuery({
    queryKey: ["useGetNotification"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notification").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id_branch: string; comment: string }) => {
      console.log("DATACOmnet", data);
      try {
        const { data: insertComment, error: insertCommentError } =
          await supabase.from("comment").insert({
            id_branch: data.id_branch,
            comment: data.comment,
          });

        if (insertCommentError) {
          throw new Error(
            `Error inserting into comment table: ${insertCommentError.message}`
          );
        }

        return insertComment;
      } catch (error) {
        console.error("Error inserting product:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "branch",
          "all",
          "batch",
          "batches",
          "localbatch",
          "id_products",
          "products",
          "backInventory",
          "setBatch",
          "useExpiredProductsHistoru",
          "initialcashcount",
          "useGetNotification",
          "useGetComment",
        ],
      });
    },
  });
};

export const useGetComment = (id_branch: string, date: string) => {
  return useQuery({
    queryKey: ["useGetComment", id_branch, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment")
        .select("*")
        .eq("id_branch", id_branch);

      const filteredData = data?.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === date;
      });
      if (error) {
        throw new Error(error.message);
      }
      return filteredData;
    },
  });
};

export const useInsertReceivePendingStocks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id_branch: string) => {
      try {
        const { data: pendingStocks, error: pendingStocksError } =
          await supabase
            .from("pendinglocalbatch")
            .select("*")
            .eq("id_branch", id_branch);

        if (pendingStocksError) {
          throw new Error(
            `Error fetching pending stocks: ${pendingStocksError.message}`
          );
        }

        const insertPromises = pendingStocks.map(async (stock: any) => {
          const { data: localbatchStock, error: localbatchStockError } =
            await supabase.from("localbatch").insert({
              id_branch: stock.id_branch,
              id_batch: stock.id_batch,
              quantity: stock.quantity,
              id_products: stock.id_products,
            });

          if (localbatchStockError) {
            throw new Error(
              `Error inserting into localbatch: ${localbatchStockError.message}`
            );
          }

          const { error: deletePendingStockError } = await supabase
            .from("pendinglocalbatch")
            .delete()
            .eq("id_pendinglocalbranch", stock.id_pendinglocalbranch);

          if (deletePendingStockError) {
            throw new Error(
              `Error deleting pending stock: ${deletePendingStockError.message}`
            );
          }

          return localbatchStock;
        });

        await Promise.all(insertPromises);

        return insertPromises;
      } catch (error) {
        console.error("Error processing pending stocks:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "branch",
          "all",
          "batch",
          "batches",
          "localbatch",
          "id_products",
          "products",
          "backInventory",
          "setBatch",
          "useExpiredProductsHistory",
          "initialcashcount",
          "useGetNotification",
          "useGetComment",
          "useGetReceivePendingStocks",
        ],
      });
    },
  });
};

export const useGetReceivePendingStocks = (id_branch: string) => {
  return useQuery({
    queryKey: ["useGetReceivePendingStocks", id_branch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pendinglocalbatch")
        .select("*, id_products(name)")
        .eq("id_branch", id_branch);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
