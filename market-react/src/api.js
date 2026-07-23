export const PRODUCTOS_MOCK = [
  { id: 1, title: 'Auriculares Premium Inalámbricos', price: 89.99, category: 'Electrónica', description: 'Cancelación activa de ruido, batería de 40 horas y sonido de alta resolución premium.', image: 'https://i.imgur.com/6Iej2c3.png', rating: { rate: 4.5 } },
  { id: 2, title: 'Mochila Impermeable Urbana', price: 45.0, category: 'Accesorios', description: 'Diseño ergonómico con compartimento acolchado para laptop de hasta 15.6 pulgadas.', image: 'https://i.imgur.com/7T1h9yK.png', rating: { rate: 4.2 } },
  { id: 3, title: 'Reloj Inteligente Fit Pro', price: 129.5, category: 'Electrónica', description: 'Monitoreo cardíaco las 24 horas, GPS integrado y pantalla AMOLED de alta definición.', image: 'https://i.imgur.com/RfR7TKF.png', rating: { rate: 4.7 } },
  { id: 4, title: 'Chaqueta Cortavientos Deportiva', price: 59.9, category: 'Ropa', description: 'Tejido ultraligero y transpirable, ideal para correr y actividades al aire libre.', image: 'https://i.imgur.com/eKjTgdx.png', rating: { rate: 4.0 } },
  { id: 5, title: 'Botella Térmica de Acero', price: 24.99, category: 'Hogar', description: 'Mantiene bebidas frías por 24 horas o calientes por 12 horas. Libre de BPA.', image: 'https://i.imgur.com/Qg5Qobb.png', rating: { rate: 4.8 } },
  { id: 6, title: 'Teclado Mecánico RGB', price: 74.95, category: 'Electrónica', description: 'Switches mecánicos táctiles, retroiluminación personalizable y distribución en español.', image: 'https://i.imgur.com/LYK6xgL.png', rating: { rate: 4.6 } }
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

function createNetworkInfo(url, status, ok, size) {
  return { url, status, ok, size };
}

export function fetchProducts(apiUrl, scenario, addLog, updateNetwork) {
  return new Promise((resolve, reject) => {
    const baseInfo = createNetworkInfo(apiUrl, 'Pending...', null, '0 B');
    updateNetwork(baseInfo);
    addLog(`Iniciando petición a ${apiUrl}`, 'info');

    if (scenario === 'error_cors') {
      setTimeout(() => {
        addLog('Error detectado: Failed to fetch', 'error');
        updateNetwork(createNetworkInfo(apiUrl, 'CORS / Network error', false, '0 B'));
        reject(new Error('No se pudo conectar: posible política CORS o servidor inaccesible'));
      }, 900);
      return;
    }

    if (scenario === 'error_500') {
      setTimeout(() => {
        addLog('Respuesta recibida: 500 Internal Server Error', 'warn');
        updateNetwork(createNetworkInfo(apiUrl, '500 Internal Server Error', false, '120 B'));
        reject(new Error('Error del servidor: código 500'));
      }, 900);
      return;
    }

    if (scenario === 'infinite_loading') {
      addLog('Simulación de carga infinita: el loader permanece activo hasta que cambies de escenario.', 'warn');
      updateNetwork(createNetworkInfo(apiUrl, 'Timeout simulado', null, '0 B'));
      return;
    }

    if (scenario === 'unexpected_json') {
      setTimeout(() => {
        const payload = {
          success: true,
          status_code: 200,
          metadata: { total: PRODUCTOS_MOCK.length },
          results: PRODUCTOS_MOCK
        };
        addLog('Respuesta JSON recibida con estructura inesperada.', 'success');
        addLog('El cliente extrae la propiedad results para evitar fallos en .map().', 'info');
        updateNetwork(createNetworkInfo(apiUrl, '200 OK', true, formatBytes(JSON.stringify(payload).length)));
        resolve(payload.results);
      }, 900);
      return;
    }

    if (scenario === 'mock_success') {
      setTimeout(() => {
        addLog('Carga local satisfactoria usando datos de respaldo.', 'success');
        updateNetwork(createNetworkInfo(apiUrl, '200 OK (Mock)', true, formatBytes(JSON.stringify(PRODUCTOS_MOCK).length)));
        resolve(PRODUCTOS_MOCK);
      }, 700);
      return;
    }

    fetch(apiUrl)
      .then(response => {
        addLog(`Respuesta de red recibida: ${response.status}`, response.ok ? 'success' : 'warn');
        if (!response.ok) {
          updateNetwork(createNetworkInfo(apiUrl, `${response.status} ${response.statusText}`, false, '0 B'));
          throw new Error(`Respuesta no OK: ${response.status}`);
        }
        return response.json().then(data => ({ response, data }));
      })
      .then(({ response, data }) => {
        const size = formatBytes(JSON.stringify(data).length);
        addLog('JSON parseado con éxito.', 'success');
        if (Array.isArray(data)) {
          updateNetwork(createNetworkInfo(apiUrl, `${response.status} OK`, true, size));
          resolve(data);
        } else if (data && typeof data === 'object') {
          const extracted = data.products || data.data || data.results || [];
          addLog('Se detectó un objeto. Extrayendo colección alternativa.', 'warn');
          updateNetwork(createNetworkInfo(apiUrl, `${response.status} OK`, true, size));
          resolve(Array.isArray(extracted) ? extracted : []);
        } else {
          updateNetwork(createNetworkInfo(apiUrl, `${response.status} OK`, true, size));
          resolve([]);
        }
      })
      .catch(err => {
        addLog(`Error en fetch: ${err.message}`, 'error');
        updateNetwork(createNetworkInfo(apiUrl, 'Failed', false, '0 B'));

        if (scenario === 'real_api') {
          addLog('No se pudo cargar la API real. Cargando datos mock local para evitar "Sin productos".', 'warn');
          updateNetwork(createNetworkInfo(apiUrl, 'Fallback: Mock local', true, formatBytes(JSON.stringify(PRODUCTOS_MOCK).length)));
          resolve(PRODUCTOS_MOCK);
          return;
        }

        reject(new Error(`No se pudieron cargar los productos: ${err.message}`));
      });
  });
}
