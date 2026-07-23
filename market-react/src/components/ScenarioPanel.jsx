import { useState } from 'react';

export default function ScenarioPanel({ currentScenario, currentUrl, onScenarioChange, onCustomUrl }) {
  const [customUrl, setCustomUrl] = useState(currentUrl);
  const scenarios = [
    { id: 'real_api', label: 'API Real Externa', url: 'https://fakestoreapi.com/products' },
    { id: 'mock_success', label: 'Éxito Local (Mock)', url: 'https://mi-tienda-local.com/api/productos' },
    { id: 'error_cors', label: 'Error CORS / Red', url: 'https://api-sin-cors-permitido.com/items' },
    { id: 'unexpected_json', label: 'JSON Anidado', url: 'https://api-anidada.com/products-custom' },
    { id: 'error_500', label: 'Error 500', url: 'https://api-rota.com/products' },
    { id: 'infinite_loading', label: 'Carga Infinita', url: 'https://api-lenta.com/slow-response' }
  ];

  return (
    <>
      <div className="panel-top">
        <div>
          <p className="section-title">Inyección de Escenarios</p>
          <p className="section-copy">Selecciona un modo para forzar el comportamiento de la API y ver el estado de carga o error.</p>
        </div>
        <button className="button small" type="button" onClick={() => onScenarioChange('real_api', customUrl)}>Probar URL</button>
      </div>

      <div className="scenario-buttons">
        {scenarios.map(option => (
          <button
            key={option.id}
            type="button"
            className={`option-button ${currentScenario === option.id ? 'active' : ''}`}
            onClick={() => {
              setCustomUrl(option.url);
              onScenarioChange(option.id, option.url);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <p className="small-text">Probar tu propia URL:</p>
        <div className="input-group">
          <input
            value={customUrl}
            onChange={event => setCustomUrl(event.target.value)}
            type="text"
            placeholder="https://tu-api.com/productos"
          />
          <button className="button small" type="button" onClick={() => onCustomUrl(customUrl)}>Ejecutar</button>
        </div>
      </div>
    </>
  );
}
