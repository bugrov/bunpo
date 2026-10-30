// Свои поля definePageMeta. `public: true` открывает страницу для гостя (глобальный middleware auth закрывает всё остальное).
declare module '#app' {
  interface PageMeta {
    public?: boolean;
  }
}

export {};
