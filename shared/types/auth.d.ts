// Форма пользователя в сессии nuxt-auth-utils: минимум данных, содержимое видно клиенту.
declare module '#auth-utils' {
  interface User {
    id: string;
    displayName: string;
  }
}

export {};
