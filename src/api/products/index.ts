import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types";
import { useMutation, useQuery, useQueryClient,  } from "@tanstack/react-query";

            
        export const useProductList = (tableName: string) => {
            return useQuery({
            queryKey: [tableName],
            queryFn: async () => {
                const { data, error } = await supabase.from(tableName).select('*');
                if (error) {
                throw new Error(error.message);
                }
                return data;
            }
            });
        };

        export const useProduct = (id: number, tableName: string) => {
            return useQuery({
              queryKey: [tableName, id],
              queryFn: async () => {
                const { data, error } = await supabase
                  .from(tableName)
                  .select('*')
                  .eq('id', id)
                  .single();
          
                if (error) {
                  throw new Error(error.message);
                }
                return data;
              },
            });
          };

          export const useInsertProduct = (tableName: string) => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(data: any) {
                const { data: newProduct, error } = await supabase
                  .from(tableName)
                  .insert({
                    name: data.name,
                    price: data.price,
                    image: data.image,
                  }).single();
                if (error) {
                  throw new Error(error.message);
                }
                return newProduct;
              },
              async onSuccess() {
                await queryClient.invalidateQueries({ queryKey: [tableName] });
              },
            });
          };
          

          export const useUpdateProduct = (tableName: string) => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(data: any) {
                const { data: updateProduct, error } = await supabase
                  .from(tableName)
                  .update({
                    name: data.name,
                    price: data.price,
                    image: data.image,
                  })
                  .eq('id', data.id)
                  .select()
                  .single();
          
                if (error) {
                  throw new Error(error.message);
                }
                return updateProduct;
              },
              async onSuccess(_, { id }) {
                await queryClient.invalidateQueries({ queryKey: [tableName] });
                await queryClient.invalidateQueries({ queryKey: [tableName, id] });
              },
            });
          };

          export const useDeleteProduct = (tableName: string) => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(id: number) {
                const { error } = await supabase
                  .from(tableName)
                  .delete()
                  .eq('id', id);
                if (error) {
                  throw new Error(error.message);
                }
              },
              async onSuccess() {
                await queryClient.invalidateQueries({ queryKey: [tableName] });
              },
            });
          };