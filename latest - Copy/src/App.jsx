import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { globalStyles } from './styles/theme';
import { useTranslation } from 'react-i18next';
import logo from './assets/logo.png';
import cartLogo from './assets/cart.png';
import './i18n';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import LoginRegister from './pages/LoginRegister';
import Sell from './pages/Sell';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';

const GlobalStyle = createGlobalStyle`
  ${globalStyles}
`;

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  const { t, i18n } = useTranslation();

  // Fetch cart from MongoDB when user logs in
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/cart/${user.email}`)
        .then(res => res.json())
        .then(data => {
          setCartItems(data?.items || []);
        });
    }
  }, [user]);

  // Save cart to MongoDB
  const saveCartToDB = async (updatedCart) => {
    if (!user?.email) return;
    // Ensure items match backend schema
    const normalizedItems = (updatedCart || []).map((p) => ({
      name: p.name,
      price: p.price,
      material: p.material ?? '',
      rating: typeof p.rating === 'number' ? p.rating : Number(p.rating) || 4,
      image: p.image,
      productId: p._id || p.id || undefined,
      quantity: p.quantity ? Number(p.quantity) : 1
    }));
    try {
      const response = await fetch('http://localhost:5000/api/cart/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email, items: normalizedItems })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to save cart:', response.status, text);
      }
    } catch (error) {
      console.error('Network error saving cart:', error);
    }
  };

  const addToCart = (product) => {
    const updated = [...cartItems, product];
    setCartItems(updated);
    saveCartToDB(updated);
    alert(`${product.name} has been added to your cart.`);
  };

  const removeFromCart = (indexToRemove) => {
    const updated = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updated);
    saveCartToDB(updated);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCartItems([]);
  };

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <GlobalStyle />
      <div className="App">
        {/* Header */}
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.headerTitle}>{t('craftedWonders')}</h1>
        </header>

        {/* Navbar */}
        <nav style={styles.navbar} className="navbar">
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Search products...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              aria-label="Search products"
            />
            <button style={styles.searchButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <Link to="/" className="nav-link" style={styles.navLink}>{t('home')}</Link>
          <Link to="/sell" className="nav-link" style={styles.navLink}>{t('sell')}</Link>
          <Link to="/contact" className="nav-link" style={styles.navLink}>{t('contact')}</Link>
          <Link to="/admin" className="nav-link" style={styles.navLink}>{t('admin')}</Link>
          <div style={styles.languageSwitcher}>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={styles.langSelect}
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
              <option value="as">অসমীয়া (Assamese)</option>
              <option value="mai">मैथिली (Maithili)</option>
              <option value="sat">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
            </select>
          </div>
         
          {user ? (
            <>
              <span className="nav-link" style={styles.navLink}>{t('welcome', { username: user.username })}</span>
              <span className="nav-link" style={styles.navLink} onClick={handleLogout}>{t('logout')}</span>
            </>
          ) : (
            <Link to="/login" className="nav-link" style={styles.navLink}>{t('login')}</Link>
          )}
          <Link to="/cart" className="nav-link" style={styles.navLink} title={t('cart')}>
            <img src={cartLogo} alt={t('cart')} style={styles.cartIcon} />
            ({cartItems.length})
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} user={user} searchQuery={debouncedSearchQuery} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="/payment" element={<Payment cartItems={cartItems} />} />
          <Route path="/sell" element={<Sell user={user} />} />
          <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>{t('copyright')}</p>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 30px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  logo: {
    height: '50px',
    width: 'auto',
    marginRight: '15px',
    borderRadius: '5px'
  },
  headerTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.8rem',
    margin: 0,
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '15px 20px',
    background: 'rgba(217, 233, 207, 1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '0',
    zIndex: '1000',
    gap: '10px'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px',
    position: 'relative',
    width: '300px',
    height: '36px',
    transition: 'all 0.3s ease',
    '@media (max-width: 768px)': {
      width: '200px',
    },
    '@media (max-width: 480px)': {
      width: '150px',
    },
  },
  searchInput: {
    width: '100%',
    height: '100%',
    padding: '8px 40px 8px 15px',
    borderRadius: '20px',
    border: '2px solid #2c3e50',
    fontSize: '0.9em',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#96A78D',
    color: 'white',
    '&:focus': {
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)'
    },
    '&::placeholder': {
      color: 'white',
      opacity: 1
    }
  },
  searchButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    '&:hover': {
      color: '#3498db'
    }
  },
  navLink: {
    margin: '0 5px',
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '2px solid #2c3e50',
    transition: 'all 0.3s ease',
    fontSize: '0.95em',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    '&:hover': {
      backgroundColor: 'rgba(44, 62, 80, 0.1)'
    }
  },
  cartIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    objectFit: 'contain'
  },
  languageSwitcher: {
    margin: '0 10px',
    position: 'relative',
    minWidth: '150px',
  },
  langSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '20px',
    border: '2px solid #2c3e50',
    backgroundColor: 'transparent',
    color: '#2c3e50',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232c3e50%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '12px auto',
    paddingRight: '30px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(44, 62, 80, 0.05)'
    },
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(44, 62, 80, 0.2)'
    }
  },
  footer: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    textAlign: 'center',
    padding: '25px 0',
    marginTop: '60px',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
  }
};

export default App;
