// Статус HTTP-ошибки из $fetch (ofetch FetchError) или undefined, если это не HTTP-ошибка.
export const fetchErrorStatus = (error: unknown): number | undefined => {
  if (error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }
};

// Сообщение сервера (поле message тела ответа) показываем только для ожидаемых 401 и 409: они наши и безопасные.
// Остальное заменяем общим текстом.
export const fetchErrorMessage = (error: unknown, fallback: string): string => {
  const status = fetchErrorStatus(error);

  if ((status === 401 || status === 409) && error instanceof Error && 'data' in error) {
    const { data } = error;

    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' && data.message) {
      return data.message;
    }
  }

  return fallback;
};
