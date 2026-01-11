import React from 'react';

interface AuthLoadingGuardProps {
  loading: boolean;
  children: React.ReactNode;
}

export const AuthLoadingGuard: React.FC<AuthLoadingGuardProps> = ({ loading, children }) => {
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #FFD700',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#E0E0E0', fontSize: 18 }}>Carregando NewsFlow OS...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
