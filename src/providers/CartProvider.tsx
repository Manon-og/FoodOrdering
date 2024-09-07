import { createContext, useContext, type PropsWithChildren, useState } from 'react';
import { CartItem, Product } from '@/src/types';
import { randomUUID } from 'expo-crypto'

type CartType = {
    items: CartItem[], 
    addItem: ( product: Product) => void,
    updateQuantity: (itemId: string, amount: -1 | 1) => void, 
    total: number,
};

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
    
});

const CartProvider = ({children}:  any ) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const addItem = (product: any) => {
        const existingItem = items.find((item) => item.id_products === product.id_products);
        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product,
            quantity: 1,
            id_products: product.id_products,
        };

        setItems(prevItems => [...prevItems, newItem]);
    };

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        const updatedItems = items.map((item) => 
            item.id !== itemId ? item : {...item, quantity: item.quantity + amount}
        ).filter((item) => item.quantity > 0);
        setItems(updatedItems);

    };

   const total = items.reduce((acc, item) => acc + item.product.id_price.amount * item.quantity, 0);
    const roundedTotal = parseFloat(total.toFixed(2));
    

    return (
    <CartContext.Provider value ={{ items, addItem, updateQuantity, total }} >
        {children}
    </CartContext.Provider>
    )
}

export default CartProvider;
export const UseCart = () => useContext(CartContext);