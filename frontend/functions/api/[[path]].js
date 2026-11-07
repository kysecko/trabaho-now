const API_ORIGIN = "https://trabaho-now-api.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  return fetch(new Request(API_ORIGIN + url.pathname + url.search, request));
}