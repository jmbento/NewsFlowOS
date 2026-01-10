/**
 * Theme Service
 * Suporte para Dark e Light mode
 */

export type Theme = 'dark' | 'light';

export const theme = {
  /**
   * Define o tema atual
   */
  setTheme: (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    
    localStorage.setItem('newsflow_theme', newTheme);
    
    // Dispara evento para atualizar componentes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  },

  /**
   * Retorna o tema atual
   */
  getTheme: (): Theme => {
    const saved = localStorage.getItem('newsflow_theme') as Theme;
    return saved || 'dark'; // Dark Mode Premium como padrão
  },

  /**
   * Alterna entre dark e light
   */
  toggle: () => {
    const current = theme.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    theme.setTheme(newTheme);
    return newTheme;
  },

  /**
   * Inicializa o tema
   */
  init: () => {
    const savedTheme = theme.getTheme();
    theme.setTheme(savedTheme);
  },
};

// Inicializa ao carregar
if (typeof window !== 'undefined') {
  theme.init();
}
