import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, PRODUCTOS_MOCK } from './api.js';
import useFavorites from './hooks/useFavorites.js';
import Header from './components/Header.jsx';
import ScenarioPanel from './components/ScenarioPanel.jsx';
import CategoryFilters from './components/CategoryFilters.jsx';
import ProductCard from './components/ProductCard.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartPanel from './components/CartPanel.jsx';
import LogsConsole from './components/LogsConsole.jsx';

const DEFAULT_API = 'https://fakestoreapi.com/products';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [logs, setLogs] = useState([]);
  const [network, setNetwork] = useState({ url: '', status: 'Esperando...', ok: null, size: '0 B' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [scenario, setScenario] = useState('real_api');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  const { favorites, toggleFavorite, favoriteCount } = useFavorites();

  const addLog = (message, type = 'info') => {
    setLogs(previous => [{ time: new Date().toLocaleTimeString(), message, type }, ...previous]);
  };

  const updateNetwork = value => setNetwork(value);

  const clearError = () => setError(null);

  const loadProducts = () => {
    clearError();
    setLoading(true);
    setProducts([]);
    fetchProducts(apiUrl, scenario, addLog, updateNetwork)
      .then(data => {
        setProducts(data);
        setLoading(false);
        addLog('Productos listos para mostrar.', 'success');
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [apiUrl, scenario]);

  const categories = useMemo(() => ['all', ...new Set(products.map(item => item.category).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const title = (product.title || product.name || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const searchMatch = title.includes(searchTerm.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || category === categoryFilter.toLowerCase();
      return searchMatch && categoryMatch;
    });
  }, [products, searchTerm, categoryFilter]);

  const addToCart = productId => {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => (item.id === productId ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    addLog(`Producto agregado al carrito: ${product.title}`, 'success');
  };

  const removeFromCart = productId => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const openProductModal = productId => {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    setActiveProduct(product);
  };

  const closeProductModal = () => setActiveProduct(null);

  const currentScenarioLabel = scenario === 'real_api' ? 'API Real Externa' : scenario === 'mock_success' ? 'Mock Local' : scenario.replace('_', ' ');

  return (
    <div className="container">
      <header className="header">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={loadProducts}
          favoriteCount={favoriteCount}
        />
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 1.25fr 0.9fr' }}>
        <section className="panel">
          <ScenarioPanel
            currentScenario={scenario}
            currentUrl={apiUrl}
            onScenarioChange={(nextScenario, nextUrl) => {
              setScenario(nextScenario);
              setApiUrl(nextUrl || apiUrl);
            }}
            onCustomUrl={url => {
              setScenario('real_api');
              setApiUrl(url);
            }}
          />

          <div className="panel" style={{ marginTop: 20 }}>
            <div className="console-top">
              <p className="section-title">Consola</p>
              <button className="text-button" onClick={() => setLogs([])}>Limpiar</button>
            </div>
            <LogsConsole logs={logs} />
          </div>

          <div className="network-card" style={{ marginTop: 20 }}>
            <div>
              <small>Petición</small>
              <div>{network.url ? `GET ${network.url}` : 'Ninguna petición'}</div>
            </div>
            <div>
              <small>Estado</small>
              <div className={`network-status ${network.ok === true ? 'ok' : network.ok === false ? 'error' : 'pending'}`}>{network.status}</div>
            </div>
            <div>
              <small>Tamaño</small>
              <div>{network.size}</div>
            </div>
          </div>
        </section>

        <main className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="cards-row">
            <div>
              <p className="section-title">Catálogo de productos</p>
              <p className="section-copy">Los productos se muestran con manejo de errores y filtros seguros.</p>
            </div>
            <CategoryFilters categories={categories} selected={categoryFilter} onChange={setCategoryFilter} />
          </div>

          {loading && (
            <div id="loading-panel" className="panel">
              <div className="section-title">Cargando...</div>
              <p className="section-copy">Buscando productos. Si el escenario es "Carga Infinita", espera que el loader quede activo.</p>
            </div>
          )}

          {error ? (
            <div id="error-panel" className="error-card">
              <h2>Error de conexión</h2>
              <p>{error}</p>
              <div className="cart-footer" style={{ marginTop: 20 }}>
                <button className="button" onClick={loadProducts} disabled={loading}>Intentar reconectar</button>
                <button className="button text-button" onClick={() => {
                  setScenario('mock_success');
                  setApiUrl('https://mi-tienda-local.com/api/productos');
                }}>Usar datos de respaldo</button>
              </div>
            </div>
          ) : (
            <div id="products-panel" style={{ display: 'contents' }}>
              {filteredProducts.length === 0 && !loading ? (
                <div id="no-results" className="no-results">
                  <h3>Sin productos</h3>
                  <p>No se encontraron productos con los filtros actuales.</p>
                </div>
              ) : null}
              <div id="product-list" className="grid-3">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={openProductModal}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <aside className="panel cart-card" id="cart-panel" style={{ display: cart.length ? 'block' : 'none' }}>
          <CartPanel cart={cart} total={totalPrice} onRemove={removeFromCart} onCheckout={() => {
            setCart([]);
            addLog('Pedido finalizado con éxito en el ambiente de pruebas.', 'success');
            window.alert('¡Compra procesada con éxito en este ambiente de pruebas!');
          }} />
        </aside>
      </div>

      <ProductModal
        product={activeProduct}
        onClose={closeProductModal}
        onAddToCart={id => { addToCart(id); closeProductModal(); }}
      />
    </div>
  );
}

export default App;
