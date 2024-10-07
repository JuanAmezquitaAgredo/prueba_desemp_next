'use client'
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar/Navbar';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  quantity: number;
  price: number;
}

const Checkout = () => {
  const router = useRouter();
  const traduction = useTranslations("homeView");
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const nameProfile = session?.user.email;
  
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = JSON.parse(localStorage.getItem('cart') || '[]');
      const fetchedProducts: any[] = [];

      for (const product of productIds) {
        const id = product.id;
        try {
          const response = await fetch(`http://192.168.88.39:7000/auth/products/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.user.tokenJWT}`,
            },
          });

          if (response.ok) {
            const productData = await response.json();
            fetchedProducts.push({ ...productData, quantity: product.quantity });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }

      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, [session]);

  const toggleLike = (id: number) => {
    setLikedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(productId => productId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const addProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newProduct = {
        id: product.id,
        quantity: 1,
        price: product.price
      };
      const storedProducts = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProduct = storedProducts.find((p: any) => p.id === newProduct.id);

      if (existingProduct) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        storedProducts.push(newProduct);
      }
      localStorage.setItem('cart', JSON.stringify(storedProducts));
      router.push("/checkout");
    }
  };

  const removeProduct = (productId: number) => {
    const storedProducts = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = storedProducts.findIndex((p: any) => p.id === productId);

    if (existingProductIndex !== -1) {
      if (storedProducts[existingProductIndex].quantity > 1) {
        storedProducts[existingProductIndex].quantity -= 1;
      } else {
        storedProducts.splice(existingProductIndex, 1);
      }
      localStorage.setItem('cart', JSON.stringify(storedProducts));
    }
  };

  const handleBack = () => {
    router.push('/');
  };


  const handlePay = async () => {

    const productsToSend = localStorage.getItem('cart');
    if (!productsToSend) return;
    const cart: Product[] = JSON.parse(productsToSend);
    const { priceTotal, totalItems } = cart.reduce((acc: { priceTotal: number; totalItems: number }, producto: Product) => {
      acc.priceTotal += producto.price * producto.quantity;
      acc.totalItems += producto.quantity;
      return acc;
    }, { priceTotal: 0, totalItems: 0 });

    const requestBody = {
      products: cart,
      totalItems: totalItems,
      priceTotal: priceTotal,
    };

    try {
      const response = await fetch(`http://192.168.88.39:7000/auth/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.tokenJWT}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        Swal.fire("Venta:", responseData.message);
      } else {
        const errorData = await response.json();
        Swal.fire("Error:", errorData.message);
      }
    } catch (error) {
      console.error('Error en la solicitud de pago:', error);
    }
  };

  return (
    <div>
      <div>
        <Navbar
          programName={traduction("programName")}
          viewTitle={traduction("viewTitle")}
          username={nameProfile}
        />
      </div>
      <div className={styles.buttonsop}>
        <button onClick={handleBack} className={styles.backhome}>Atras</button>
        <button onClick={handlePay} className={styles.pay}>Pagar</button>
      </div>
      <div className={styles.container}>
        <div className={styles.productsGrid}>
          {products.map((product: any) => (
            <div key={product.id} className={styles.card}>
              <img src={product.image} alt={product.title} className={styles.image} />
              <h2 className={styles.productTitle}>{product.title}</h2>
              <p className={styles.price}>${product.price}</p>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.buttonsOptions}>
                <button
                  className={`${styles.likeButton} ${likedProducts.includes(product.id) ? styles.liked : ''}`}
                  onClick={() => toggleLike(product.id)}
                >
                  {likedProducts.includes(product.id) ? '❤️ Liked' : '♡ Like'}
                </button>
                <p>{product.quantity}</p>
                <button
                  className={styles.addProduct}
                  onClick={() => addProduct(product.id)}
                >
                  +
                </button>
                <button
                  className={styles.removeProduct}
                  onClick={() => removeProduct(product.id)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
