import type { Plugin } from 'vite';

// Tailwind v4 требует `@reference "<главный css>"` в каждом <style> с @apply.
// Плагин добавляет эту строку автоматически, поэтому в компонентах её писать не нужно.
export const tailwindReference = (cssEntry: string): Plugin => {
  return {
    name: 'bunpo:tailwind-reference',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('type=style') || !code.includes('@apply') || code.includes('@reference')) {
        return null;
      }

      return `@reference "${cssEntry}";\n${code}`;
    },
  };
};
