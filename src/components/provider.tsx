'use client'
import { SessionProvider } from 'next-auth/react'
import { createContext, useEffect, useState } from 'react'

export const CartContext = createContext<any>({})

export function Provider({ children }: any) {
  const [cartProducts, setCartProducts] = useState<any[]>([])
  const ls = typeof window !== 'undefined' ? window.localStorage : null

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')!))
    }
  }, [])

  function clearCart() {
    setCartProducts([])
    saveCartProducts([])
    //ls?.removeItem('cart');
  }

  function removeCartProduct(i: any) {
    setCartProducts((oldCartProducts) => {
      const newCartProducts = oldCartProducts.filter((v, j) => j !== i)
      saveCartProducts(newCartProducts)
      return newCartProducts
    })
  }

  function saveCartProducts(cartProducts: any) {
    ls?.setItem('cart', JSON.stringify(cartProducts))
  }

  function addToCart(product: any, color = null, size = null) {
    setCartProducts((oldProducts) => {
      const newProducts = [...oldProducts, { ...product, color, size }]
      saveCartProducts(newProducts)
      return newProducts
    })
  }

  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          clearCart,
          removeCartProduct,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  )
}
