export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00';
  const rating = product.rating?.rate ? `${product.rating.rate.toFixed(1)} ⭐` : 'no disponible';

  return (
    <div id="product-modal-overlay" className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={event => event.stopPropagation()}>
        <button className="product-modal-close" type="button" onClick={onClose} aria-label="Cerrar detalles">×</button>
        <div className="product-modal-body">
          <div className="modal-image-container">
            {product.image ? (
              <img src={product.image} alt={product.title || 'Producto'} />
            ) : (
              <div className="modal-image-fallback">📦</div>
            )}
          </div>
          <div className="modal-detail-copy">
            <span className="product-category">{product.category || 'General'}</span>
            <h2 id="modal-product-title">{product.title || product.name || 'Producto sin nombre'}</h2>
            <p id="modal-product-description">{product.description || 'Descripción no disponible.'}</p>
            <div className="modal-specs">
              <div><strong>Precio:</strong> <span id="modal-product-price">${price}</span></div>
              <div><strong>Rating:</strong> <span id="modal-product-rating">{rating}</span></div>
            </div>
            <button className="button" type="button" onClick={() => onAddToCart(product.id)}>Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}
