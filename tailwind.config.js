/** @type {import('tailwindcss').Config} */
// Tokens do design system — fonte: fe/UI.md §1. Não hardcodar hex fora daqui.
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Risco — semântica clínica imutável. Texto sempre branco. Nunca decorar.
        risk: {
          alto: '#DC2626',
          'moderado-alto': '#EA580C',
          moderado: '#CA8A04',
          baixo: '#16A34A',
          seguro: '#15803D',
          benefico: '#2563EB',
          informativo: '#6B7280',
          nenhum: '#6B7280',
        },
        feedback: {
          error: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#3B82F6',
        },
        // Dark mode (page/card/surface) — fe/UI.md §9
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          surface: '#334155',
          text: '#F1F5F9',
          'text-secondary': '#94A3B8',
        },
      },
    },
  },
  plugins: [],
};
