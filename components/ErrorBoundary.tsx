import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary capturou um erro:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] border border-slate-700 rounded-lg p-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-[#FFD700] mb-4">
              ⚠️ Erro no NewsFlow OS
            </h1>
            <p className="text-[#E0E0E0] mb-4">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="text-[#A0A0A0] cursor-pointer mb-2">
                  Detalhes do erro
                </summary>
                <pre className="bg-[#121212] p-4 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-[#FFD700] text-[#121212] rounded-md font-semibold hover:bg-[#FFD700]/80 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
