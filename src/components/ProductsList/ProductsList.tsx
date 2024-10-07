'use client';

import { fetchProducts } from '@/redux/productsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.css';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';

interface ProductDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsList() {
  const traduction = useTranslations("homeView");
  const { data: session } = useSession();
  const BearerToken: string | undefined = session?.user.tokenJWT;
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const status = useSelector((state: RootState) => state.products.status);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts(BearerToken));
    }
  }, [dispatch, status]);

  const toggleLike = async (productId: number) => {
    const isLiked = likedProducts.includes(productId);
  
    try {
      const response = await fetch(`http://192.168.88.39:7000/auth/products/${productId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${BearerToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
  
        setLikedProducts((prevLikedProducts) =>
          isLiked
            ? prevLikedProducts.filter((id) => id !== productId)
            : [...prevLikedProducts, productId]
        );
      } else {
        console.error('Error al marcar el producto como me gusta');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
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
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  const openPopup = (product: ProductDetails) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error fetching products</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.productsGrid}>
        {products.map((product: any) => (
          <div 
            key={product.id} 
            className={styles.card} 
            onClick={() => openPopup(product)} 
          >
            <img src={product.image} alt={product.title} className={styles.image} />
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.price}>${product.price}</p>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.buttonsOptions}>
              <button
                className={`${styles.likeButton} ${likedProducts.includes(product.id) ? styles.liked : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleLike(product.id);
                }}
              >
                {likedProducts.includes(product.id) ? '❤️ Liked' : '♡ Like'}
              </button>
              <button 
                className={styles.addProduct} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  addProduct(product.id);
                }} 
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedProduct && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={closePopup}>&times;</span>
            <img src={selectedProduct.image} alt={selectedProduct.title} className={styles.popupImage} />
            <h2>{selectedProduct.title}</h2>
            <h3>{traduction("description")}</h3>
            <p>{selectedProduct.description}</p>
            <p>Price: ${selectedProduct.price}</p>
            <button className={styles.addProduct} onClick={() => addProduct(selectedProduct.id)}>Agregar al carrito</button>
          </div>
        </div>
      )}
    </div>
  );
}
