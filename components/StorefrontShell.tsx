'use client';import {useState} from 'react';import Header from './Header';import CartDrawer from './CartDrawer';import {CartProvider,useCart} from './CartContext';
function Inner({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false);const {lines,qty,count}=useCart();return <><Header cartCount={count} onCart={()=>setOpen(true)}/>{children}<CartDrawer open={open} onClose={()=>setOpen(false)} lines={lines} onQty={qty}/></>}
export default function StorefrontShell({children}:{children:React.ReactNode}){return <CartProvider><Inner>{children}</Inner></CartProvider>}
