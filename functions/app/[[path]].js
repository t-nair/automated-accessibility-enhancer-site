// Reverse-proxies /app and /app/* to the Flask app. Swap ORIGIN when it moves off Render.
const ORIGIN = "https://automated-accessibility-enhancer.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/app/, "") || "/";

  const upstream = await fetch(ORIGIN + path + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  const headers = new Headers(upstream.headers);
  const location = headers.get("Location");
  if (location) {
    if (location.startsWith(ORIGIN)) {
      headers.set("Location", "/app" + (location.slice(ORIGIN.length) || "/"));
    } else if (location.startsWith("/") && !location.startsWith("//")) {
      headers.set("Location", "/app" + location);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
