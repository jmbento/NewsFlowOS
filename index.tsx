
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Elemento root não encontrado!');
  document.body.innerHTML = `
    <div style="min-height: 100vh; background: #121212; color: #FFD700; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div style="background: #1E1E1E; border: 1px solid #374151; border-radius: 8px; padding: 2rem; max-width: 600px;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Erro Crítico</h1>
        <p>Elemento #root não encontrado no DOM.</p>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: #A0A0A0;">Verifique se o index.html está correto.</p>
      </div>
    </div>
  `;
  throw new Error("Could not find root element to mount to");
}

console.log('🚀 [INDEX] Iniciando renderização do React...');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ [INDEX] React renderizado com sucesso');
} catch (error) {
  console.error('❌ [INDEX] Erro ao renderizar React:', error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #121212; color: #FFD700; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div style="background: #1E1E1E; border: 1px solid #374151; border-radius: 8px; padding: 2rem; max-width: 600px;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Erro ao Renderizar</h1>
        <pre style="background: #121212; padding: 1rem; border-radius: 4px; overflow: auto; color: #ef4444; font-size: 0.75rem;">
          ${error?.toString()}
          ${error?.stack}
        </pre>
        <button
          onclick="window.location.reload()"
          style="margin-top: 1rem; padding: 0.5rem 1rem; background: #FFD700; color: #121212; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;"
        >
          Recarregar Página
        </button>
      </div>
    </div>
  `;
}
