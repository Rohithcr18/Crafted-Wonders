export const theme = {
  colors: {
    primary: '#96A78D',
    secondary: '#B6CEB4',
    accent: '#D9E9CF',
    background: '#F0F0F0',
    text: '#222',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    border: '#E9ECEF',
    success: '#28A745',
    danger: '#DC3545',
    warning: '#FFC107',
    info: '#17A2B8'
  },
  shadows: {
    small: '0 2px 8px rgba(150, 167, 141, 0.1)',
    medium: '0 4px 12px rgba(150, 167, 141, 0.15)',
    large: '0 8px 24px rgba(150, 167, 141, 0.2)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out'
  }
};

export const globalStyles = `
  :root {
    --primary: ${theme.colors.primary};
    --secondary: ${theme.colors.secondary};
    --accent: ${theme.colors.accent};
    --background: ${theme.colors.background};
    --text: ${theme.colors.text};
    --white: ${theme.colors.white};
    --light-gray: ${theme.colors.lightGray};
    --border: ${theme.colors.border};
    --success: ${theme.colors.success};
    --danger: ${theme.colors.danger};
    --warning: ${theme.colors.warning};
    --info: ${theme.colors.info};
    
    --shadow-sm: ${theme.shadows.small};
    --shadow-md: ${theme.shadows.medium};
    --shadow-lg: ${theme.shadows.large};
    
    --radius-sm: ${theme.borderRadius.small};
    --radius-md: ${theme.borderRadius.medium};
    --radius-lg: ${theme.borderRadius.large};
    --radius-xl: ${theme.borderRadius.xlarge};
    
    --space-xs: ${theme.spacing.xs};
    --space-sm: ${theme.spacing.sm};
    --space-md: ${theme.spacing.md};
    --space-lg: ${theme.spacing.lg};
    --space-xl: ${theme.spacing.xl};
    --space-xxl: ${theme.spacing.xxl};
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background-color: var(--background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  a:hover {
    color: var(--secondary);
  }
  
  button, .btn {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  button:hover, .btn:hover {
    background-color: var(--secondary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  button:active, .btn:active {
    transform: translateY(0);
  }
  
  button:disabled, .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid var(--accent);
  }
  
  .card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
  
  .text-primary {
    color: var(--primary);
  }
  
  .bg-primary {
    background-color: var(--primary);
    color: white;
  }
  
  .btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
  }
  
  .btn-outline:hover {
    background: var(--primary);
    color: white;
  }
  
  .text-center {
    text-align: center;
  }
  
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 2rem; }
  
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 2rem; }
  
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  .gap-4 {
    gap: 1rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }
  }
`;
