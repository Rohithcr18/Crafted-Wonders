import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const staticProducts = [
  {
    id: 1,
    name: 'Handwoven Basket',
    price: '499',
    material: 'Natural Jute',
    rating: 4.5,
    image: 'download.jpeg'
  },
  {
    id: 2,
    name: 'Clay Pot',
    price: '299',
    material: 'clay',
    rating: 4.2,
    image: 'clay pot.jpeg'
  },
  {
    id: 3,
    name: 'Jewelry Box',
    price: '799',
    material: 'Wooden',
    rating: 4.8,
    image: 'jwellery.jpeg'
  },
  {
    id: 4,
    name: 'Bamboo Lamp',
    price: '1299',
    material: 'Bamboo',
    rating: 4.6,
    image: 'bamboo.jpeg'
  },
  {
    id: 5,
    name: 'Coffee Cup',
    price: '199',
    material: 'ceramic',
    rating: 4.1,
    image: 'coffee.jpeg'
  }
];

function Home({ addToCart, searchQuery = '' }) {
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState([]);
  const [deletedIds, setDeletedIds] = useState(() => JSON.parse(localStorage.getItem('deletedProductIds')) || []);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const dbProducts = await res.json();
        const homeProducts = JSON.parse(localStorage.getItem('homeProducts')) || [];
        // Prefer DB products; only include local home products that aren't already in DB
        const filteredHome = homeProducts.filter(lp => !dbProducts.some(dp => dp.name === lp.name && (dp.owner || '') === (lp.owner || '') ));
        // Combine, but do NOT include staticProducts to avoid duplicates when seeded
        const combined = [...dbProducts, ...filteredHome];
        // Unique by name+owner
        const unique = [];
        const seen = new Set();
        for (const prod of combined) {
          const key = `${prod.name}|${prod.owner || ''}`;
          if (!seen.has(key)) {
            unique.push(prod);
            seen.add(key);
          }
        }
        // Apply deleted filter and search
        const filtered = unique.filter(p => 
          !deletedIds.includes(p.id) && 
          !deletedIds.includes(p._id) &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setAllProducts(filtered);
      } catch (e) {
        // Fallback to static + local
        const homeProducts = JSON.parse(localStorage.getItem('homeProducts')) || [];
        const combined = [...staticProducts, ...homeProducts];
        const filtered = combined.filter(p => 
          !deletedIds.includes(p.id) && 
          !deletedIds.includes(p._id) &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setAllProducts(filtered);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [deletedIds, searchQuery]);

  // Delete user-added product (localStorage or backend)
  const handleDelete = async (productId) => {
    const product = allProducts.find(p => p.id === productId || p._id === productId);

    // If product is from localStorage (has id, not _id)
    if (product && product.id) {
      const homeProducts = JSON.parse(localStorage.getItem('homeProducts')) || [];
      const updatedHome = homeProducts.filter(p => p.id !== productId);
      localStorage.setItem('homeProducts', JSON.stringify(updatedHome));
      setAllProducts(prev => prev.filter(p => p.id !== productId));
    }

    // If product is from backend and owned by user
    if (product && product._id && user?.email && product.owner === user.email) {
      try {
        await fetch(`http://localhost:5000/api/products/${product._id}/${user.email}`, {
          method: 'DELETE'
        });
        setAllProducts(prev => prev.filter(p => p._id !== product._id));
      } catch (err) {
        console.error('Error deleting product from MongoDB:', err);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{t('handmadeProducts')}</h2>
      <div className="grid" style={styles.grid}>
        {allProducts.map((product, index) => {
          const isOut = Number(product.stock) <= 0 || product.inStock === false;
          return (
            <div key={index} className="card" style={styles.card}>
              <div style={{ position: 'relative' }}>
                {isOut && <span style={styles.outBadge}>{t('outOfStock')}</span>}
                <img src={product.image} alt={product.name} style={styles.image} />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.price}>
                  <strong>₹</strong>
                  {String(product.price).replace(/^₹+/, '')}
                </p>
                <p style={styles.material}>{t('material')}: {product.material}</p>
                <p style={styles.rating}>{t('rating')}:{product.rating}</p>
                <p style={styles.stock}>{t('stock')}: {typeof product.stock === 'number' ? product.stock : (product.inStock ? t('inStock') : 0)}</p>

                <div className="buttonContainer" style={styles.buttonContainer}>
                  <button
                    className="button"
                    style={{...styles.button, transform: 'none', transition: 'none', boxShadow: 'none', opacity: isOut ? 0.5 : 1, pointerEvents: isOut ? 'none' : 'auto'}}
                    onClick={() => addToCart(product)}
                    disabled={isOut}
                  >
                    {t('addToCart')}
                  </button>
                  <button
                    className="buyButton"
                    style={{...styles.buyButton, transform: 'none', transition: 'none', boxShadow: 'none', opacity: isOut ? 0.5 : 1, pointerEvents: isOut ? 'none' : 'auto'}}
                    onClick={() => navigate('/payment')}
                    disabled={isOut}
                  >
                    {t('buyNow')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  form: {
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    margin: '8px 0',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '90%'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    fontSize: '0.9em',
    height: '36px',
    lineHeight: '20px',
    outline: 'none',
    transition: 'background-color 0.2s',
    boxSizing: 'border-box'
  },
  container: {
    minHeight: '100vh',
    width: '100vw',
    padding: '30px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #f3e5f5 100%)',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  heading: {
    textAlign: 'center',
    margin: '40px 0 30px',
    color: '#2c3e50',
    fontSize: '2.5em',
    fontWeight: '800',
    letterSpacing: '1.5px',
    position: 'relative',
    paddingBottom: '15px',
    textTransform: 'uppercase',
    fontFamily: '"Playfair Display", serif',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '4px',
      background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
      borderRadius: '2px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px',
    justifyContent: 'center',
    alignItems: 'stretch',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '20px',
    padding: '0',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'left',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'contain',
    marginBottom: '0',
    background: '#f8f9fa',
    padding: '10px'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '20px'
  },
  productName: {
    fontSize: '1.3em',
    marginBottom: '10px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  price: {
    fontSize: '1.4em',
    color: '#e74c3c',
    marginBottom: '8px',
    fontWeight: '700'
  },
  material: {
    fontSize: '0.95em',
    color: '#fff',
    marginBottom: '8px',
    backgroundColor: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  rating: {
    fontSize: '0.95em',
    color: '#fff',
    marginBottom: '15px',
    backgroundColor: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.95em',
    fontWeight: '600',
    width: '100%',
    maxWidth: '180px',
    height: '48px',
    lineHeight: '24px',
    transition: 'none',
    boxShadow: 'none'
  },
  buyButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.95em',
    fontWeight: '600',
    width: '100%',
    maxWidth: '180px',
    height: '48px',
    lineHeight: '24px',
    transition: 'none',
    boxShadow: 'none'
  },
  outBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: '#e74c3c',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '0.85em',
    fontWeight: '700',
    zIndex: 2
  },
  stock: {
    fontSize: '0.95em',
    color: '#fff',
    marginTop: '4px',
    backgroundColor: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  }
};

export default Home;
