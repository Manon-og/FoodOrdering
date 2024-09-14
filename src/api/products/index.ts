import { supabase } from "@/src/lib/supabase";
import { useMutation, useQuery, useQueryClient,  } from "@tanstack/react-query";

            
        export const useProductList = (id : string) => {
          return useQuery({
            queryKey: ['products', id],
            queryFn: async () => {
              const { data, error } = 
                await supabase
                  .from('products')
                  .select(`*, id_price(amount)`)
                  .eq('id_category', id);
              if (error) {
                throw new Error(error.message);
              }
              return data;
            }
          });
        };

        export const useProduct = (id: number) => {
            return useQuery({
              queryKey: ['products', id],
              queryFn: async () => {
                const { data, error } = await supabase
                  .from('products')
                  .select('*, id_price(amount)')
                  .eq('id_products', id)
                  .single();
          
                if (error) {
                  throw new Error(error.message);
                }
                return data;
              },
            });
          };


          export const useInsertProduct = (id : number) => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(data: any) {
                const { data: newIdPrice }: { data: any} = await supabase
                .from('price')
                .select('id_price')
                .eq('amount', data.id_price.amount)
                .single();
              console.log('price',newIdPrice);

              if (newIdPrice) {
                const { data: updateProduct, error } = await supabase
                .from('products')
                .insert({
                  name: data.name,
                  description: data.description,
                  image: data.image,
                  id_price: newIdPrice.id_price,
                  id_category: id,
                })
                .eq('id_products', data.id)
                .single();
              if (error) {
                throw new Error(error.message);
              }
              }

             else {
                console.log('POTA PLEASEEEEEE');
                const { data: newPrice, error: priceError }: { data: any, error: any } = await supabase
                .from('price')
                .insert({
                  amount: data.id_price.amount,
                })
                .single();

                const { data: newIdPrice }: { data: any} = await supabase
                .from('price')
                .select('*')
                .eq('amount', data.id_price.amount)
                .single();
                console.log('POTA PLEASEEEEEE');
                console.log('POTA',newIdPrice);
            
              const { data: updateProduct, error } = await supabase
                .from('products')
                .insert({
                  name: data.name,
                  description: data.description,
                  image: data.image,
                  id_price: newIdPrice.id_price,
                  id_category: id,
                })
                .eq('id_products', data.id)
                .single();
              if (error) {
                throw new Error(error.message);
              }

              return updateProduct;
              }
            },
              
              async onSuccess() {
                await queryClient.invalidateQueries({ queryKey: ['products'] });
              },
            });
          };
          

          export const useUpdateProduct = () => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(data: any) {
                const { data: newIdPrice }: { data: any} = await supabase
                .from('price')
                .select('id_price')
                .eq('amount', data.id_price.amount)
                .single();
              console.log('price',newIdPrice);

              if (newIdPrice) {
                const { data: updateProduct, error } = await supabase
                .from('products')
                .update({
                  name: data.name,
                  description: data.description,
                  image: data.image,
                  id_price: newIdPrice.id_price,
                })
                .eq('id_products', data.id)
                .single();
              if (error) {
                throw new Error(error.message);
              }
              }

             else {
                console.log('POTA PLEASEEEEEE');
                const { data: newPrice, error: priceError }: { data: any, error: any } = await supabase
                .from('price')
                .insert({
                  amount: data.id_price.amount,
                })
                .single();

                const { data: newIdPrice }: { data: any} = await supabase
                .from('price')
                .select('*')
                .eq('amount', data.id_price.amount)
                .single();
                console.log('POTA PLEASEEEEEE');
                console.log('POTA',newIdPrice);
            
              const { data: updateProduct, error } = await supabase
                .from('products')
                .update({
                  name: data.name,
                  description: data.description,
                  image: data.image,
                  id_price: newIdPrice.id_price,
                })
                .eq('id_products', data.id)
                .single();
              if (error) {
                throw new Error(error.message);
              }

              return updateProduct;
              }
            },
              async onSuccess(_, { id }) {
                await queryClient.invalidateQueries({ queryKey: ['products'] });
                await queryClient.invalidateQueries({ queryKey: ['products', id] });
              },
            });
          };


          export const useDeleteProduct = (id : number) => {
            const queryClient = useQueryClient();
          
            return useMutation({
              async mutationFn(id: number) {
                const { error } = await supabase
                  .from('products')
                  .delete()
                  .eq('id_products', id);

                  console.log('id',id);
                if (error) {
                  throw new Error(error.message);
                }
              },
              async onSuccess() {
                await queryClient.invalidateQueries({ queryKey: ['products'] });
              },
            });
          };

          
          export const useInsertBatch = () => {
            const queryClient = useQueryClient();
          
            return useMutation({
              mutationFn: async (data: any) => {
                try {
                  const { data: newBatch, error } = await supabase
                    .from('batch')
                    .insert({
                      batch: data.quantity,
                      id_products: data.id_products,
                    });
                  return newBatch;
                } catch (error) {
                  console.error('Error inserting batch:', error);
                  throw error;
                }
              },
              onSuccess: async (data) => {
                await queryClient.invalidateQueries({ queryKey: ['batches'] });
              },
            });
          };

          export const useBatchList = (id: number) => {
            return useQuery({
              queryKey: ['batch', id],
              queryFn: async () => {
                const { data, error } = await supabase
                  .from('batch')
                  .select('*, id_products(name)')
                  .eq('id_products', id)
                if (error) {
                  throw new Error(error.message);
                }
                return data;
              },
            });
          } 

   