import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import Pagination from '../Pagination'

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart,isInCart } = useCart();

  const PRODUCTS_PER_PAGE = 6;

  const handleAddToCart = (product) => {
    if (!isInCart(product.id)) {
      addToCart(product);
    }
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) return <div className="skeleton">Loading...</div>;
  if (error) return <p>Failed to load products.</p>;

  return (
    <div>
      <div className="grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="card">
            <Link href={`/products/${product.id}`}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </Link>
            <button onClick={() => handleAddToCart(product)} disabled={isInCart(product.id)}>
              {isInCart(product.id)  ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
      <Pagination
        totalProducts={products.length}
        productsPerPage={PRODUCTS_PER_PAGE}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}
