// tailwind.config.js (extend)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFFBF0',
          100: '#DFF5E2',
          300: '#8FDF9D',
          500: '#2F9E44', // Leaf Green (primary)
          700: '#166534', // Deep Green (hover)
        },
        accent: {
          50: '#FFF7ED',
          300: '#FCD59A',
          500: '#F97316', // Sunburst Orange
          700: '#C24B07',
        },
        info: {
          500: '#0EA5E9', // Sky Blue
        },
        success: {
          500: '#2F9E44',
          700: '#166534',
        },
        danger: {
          500: '#EF4444',
          700: '#991B1B',
        },
        neutral: {
          50: '#FFF7ED',
          100: '#F3F4F6',
          300: '#D1D5DB',
          500: '#9CA3AF',
          700: '#475569',
          900: '#0F172A',
        },
      },
    },
  },
};
