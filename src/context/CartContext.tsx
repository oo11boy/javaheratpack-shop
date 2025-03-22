"use client"
import { Course } from "@/lib/Types/Types";
import { createContext, ReactNode, useContext, useState } from "react";


// Define the context type
interface CartContextType {
  Cart: Course[];
  addtocart: (course: Course) => void;
  setCart: React.Dispatch<React.SetStateAction<Course[]>>;
  setIsCartOpen:React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen:Boolean;
}

// Create context with default values
export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [Cart, setCart] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addtocart = (course: Course) => {
    setIsCartOpen(true)
    if (!Cart.some((item) => item.id === course.id)) {
      setCart([...Cart, course]);

    }
    
  };
  const value: CartContextType = {
    addtocart,
    setCart,
    Cart,
    isCartOpen,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  return context;
};