// Mock auth for frontend only
export async function auth() {
  return null; // Not logged in by default
}

export const handlers = {
  GET: async () => new Response('OK'),
  POST: async () => new Response('OK'),
};

export async function signIn() {}
export async function signOut() {}
