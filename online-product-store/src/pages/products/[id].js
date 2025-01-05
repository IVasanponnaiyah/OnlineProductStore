import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';

export default function ProductDetails({ product }) {
    const router = useRouter();
    const { addToCart, isInCart } = useCart();

    const handleAddToCart = () => {
            addToCart(product);
    };

    if (router.isFallback) return <p>Loading...</p>;

    return (
        <div>
            <img src={product.image} alt={product.title} />
            <h1>{product.title}</h1>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <button onClick={handleAddToCart} disabled={isInCart(product.id)}>
                {isInCart(product.id)  ? 'Added' : 'Add to Cart'}
            </button>
            <button onClick={() => router.push('/products')}>
                Back to Products
            </button>
        </div>

    );
}

export async function getStaticPaths() {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();

    const paths = products.map((product) => ({
        params: { id: product.id.toString() },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
    const product = await res.json();

    return { props: { product } };
}
