export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      credentials: 'include', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', ...options
    });
  } catch { throw new Error('Cannot reach the API. Start MySQL and the backend server.'); }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
