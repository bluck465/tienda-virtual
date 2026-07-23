export default function CartPanel({ cart, total, onRemove, onCheckout }) {
  return (
    <>
      <div className="panel-top">
        <div>
          <p className="section-title">Carrito de compras</p>
          <p className="section-copy">Revisa los artículos seleccionados y finaliza tu compra en el ambiente de pruebas.</p>
        </div>
      </div>
      <div id="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div>
              <strong>{item.title}</strong>
              <div className="cart-meta">{item.qty} × ${item.price.toFixed(2)}</div>
            </div>
            <button className="button text" type="button" onClick={() => onRemove(item.id)}>Quitar</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <span>Total estimado:</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
      <button className="button" type="button" onClick={onCheckout}>Finalizar pedido</button>
    </>
  );
}
