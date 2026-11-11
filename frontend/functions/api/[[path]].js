const API_ORIGIN = "https://trabaho-now-api.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);

  // 1. Answer preflight ourselves — never forward OPTIONS upstream.
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,Accept,X-Requested-With",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin",
      },
    });
  }

  // 2. Build a clean upstream request (drop Origin/Host so Laravel sees the Render host).
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete("host");
  upstreamHeaders.delete("origin");
  upstreamHeaders.delete("referer");
  upstreamHeaders.delete("cf-connecting-ip");
  upstreamHeaders.delete("cf-ray");
  upstreamHeaders.delete("cf-visitor");
  upstreamHeaders.delete("x-forwarded-proto");
  upstreamHeaders.delete("x-forwarded-for");

  const upstream = new Request(API_ORIGIN + url.pathname + url.search, {
    method: request.method,
    headers: upstreamHeaders,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual",
  });

  // 3. Fetch upstream, then re-add CORS headers to the response.
  const response = await fetch(upstream);

  const out = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  const origin = request.headers.get("Origin");
  if (origin) {
    out.headers.set("Access-Control-Allow-Origin", origin);
    out.headers.set("Vary", "Origin");
    out.headers.set("Access-Control-Allow-Credentials", "true");
  }
  out.headers.delete("set-cookie"); // optional: uncomment if you need cookie passthrough

  return out;
}