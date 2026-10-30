// Показывать ли фуригану. Пока хранится только в state; сохранение в настройках пользователя появится вместе с БД.
export const useFurigana = () => {
  return useState<boolean>('furigana', () => true);
};
