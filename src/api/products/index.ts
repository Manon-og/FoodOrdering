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
                  .eq('amount', data.amount)
                  .single();

                let idPrice;
                if (newIdPrice) {
                  idPrice = newIdPrice.id_price;
                  const { data: newProduct, error }: { data: any, error: any } = await supabase
                  .from('products')
                  .insert({
                    name: data.name,
                    image: data.image,
                    id_price: idPrice,
                    description: data.description,
                    id_category: id
                  })
                  .single();
                if (error) {
                  throw new Error(error.message);
                }
                console.log(newProduct);
                return newProduct;
                }

                else {
                  const { data: newPrice, error: priceError }: { data: any, error: any } = await supabase
                  .from('price')
                  .insert({
                    amount: data.amount,
                  })
                  .single();
                if (priceError) {
                  throw new Error(priceError.message);
                }

                const { data: newProduct, error } = await supabase
                  .from('products')
                  .insert({
                    name: data.name,
                    image: data.image,
                    id_price: newPrice.id_price,
                    description: data.description,
                    id_category: id
                  })
                  .single();
                if (error) {
                  throw new Error(error.message);
                }
                console.log(newProduct);
                return newProduct;
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