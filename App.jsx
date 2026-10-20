import { useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Store,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { products } from "./data/products";

function Header({ cartCount }) {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <Store size={25} /> ShopEase
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-link">
          <ShoppingCart size={20} />
          Cart ({cartCount})
        </Link>
      </nav>
    </header>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="300"
        />
      </Link>

      <div className="product-info">
        <span className="category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="price">₹{product.price.toLocaleString("en-IN")}</p>

        <div className="card-actions">
          <Link className="details-btn" to={`/products/${product.id}`}>
            Details
          </Link>
          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({ addToCart }) {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">YOUR EVERYDAY STORE</span>
          <h1>Find Your Next Favorite.</h1>
          <p>Discover quality products at prices you'll love.</p>
          <Link to="/products" className="hero-btn">
            Explore Products
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Featured Products</h2>
          </div>
          <Link to="/products">View all →</Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductsPage({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

  return (
    <section className="section">
      <span className="eyebrow">OUR COLLECTION</span>
      <h1>All Products</h1>

      <div className="filters">
        <label className="search-box">
          <Search size={19} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </label>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Accessories</option>
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="empty">No products found. Try another search.</p>
      )}
    </section>
  );
}

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <section className="section"><h2>Product not found.</h2></section>;
  }

  return (
    <section className="section details-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={18} /> Back to products
      </Link>

      <div className="details-layout">
        <img src={product.image} alt={product.name} />

        <div>
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p>{product.description}</p>
          <button onClick={() => addToCart(product)}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

function CartPage({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="section">
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty">
          <ShoppingCart size={45} />
          <h2>Your cart is empty</h2>
          <Link to="/products" className="hero-btn">Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map(item => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-description">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>
                  <div className="quantity">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => updateQuantity(item.id, -1)}
                    >−</button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => updateQuantity(item.id, 1)}
                    >+</button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={19} />
                </button>
              </article>
            ))}
          </div>

          <div className="cart-total">
            <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>
            <button onClick={() => alert("Demo checkout only.")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(current => {
      const existing = current.find(item => item.id === product.id);

      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id, amount) {
    setCart(current =>
      current
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart(current => current.filter(item => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Header cartCount={cartCount} />

      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route
            path="/products"
            element={<ProductsPage addToCart={addToCart} />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetails addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="*"
            element={
              <section className="section">
                <h1>404 - Page Not Found</h1>
                <Link to="/">Return Home</Link>
              </section>
            }
          />
        </Routes>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} ShopEase. Built with React.</p>
      </footer>
    </div>
  );
}