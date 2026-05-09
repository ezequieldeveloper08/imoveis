const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const isFormData = body instanceof FormData;
  const headers: HeadersInit = isFormData ? {} : {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `HTTP ${res.status}`;
    try {
      if (isJson) {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      }
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return {} as T;

  const text = await res.text();
  try {
    return (isJson ? JSON.parse(text) : text) as T;
  } catch (e) {
    console.error('JSON Parse Error:', e, 'Raw text:', text);
    throw new Error('Erro ao processar resposta do servidor');
  }
}
