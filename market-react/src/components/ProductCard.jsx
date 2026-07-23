export default function ProductCard({ product, onAddToCart, onViewDetails, isFavorite, onToggleFavorite }) {
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00';
  const description = product.description || 'Descripción no disponible.';
  const summary = description.length > 90 ? `${description.slice(0, 90)}...` : description;

  return (
    <article className="product-card">
      <div className={`product-image ${product.image ? 'has-image' : ''}`}>
        {product.image ? (
          <img className="product-image-media" src={product.image} alt={product.title || 'Producto'} />
        ) : (
          <span className="product-emoji">📦</span>
        )}
        <span className="product-category">{product.category || 'General'}</span>
      </div>
      <div className="product-body">
        <h3>{product.title || product.name || 'Producto sin nombre'}</h3>
        <p className="product-summary">{summary}</p>
        <div className="product-footer">
          <span className="product-price">${price}</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="button small" type="button" onClick={() => onAddToCart(product.id)}>Comprar</button>
            <button className="button text-button" type="button" onClick={() => onViewDetails(product.id)}>Más...</button>
            <button className="button text-button" type="button" onClick={() => onToggleFavorite(product.id)}
              style={{ fontSize: '1.3rem', lineHeight: 1, color: isFavorite ? '#fbbf24' : '#64748b' }}>
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
