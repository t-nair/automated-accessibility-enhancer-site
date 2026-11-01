// Reverse-proxies /app and /app/* to the Flask app. Swap ORIGIN when it moves off Render.
const ORIGIN = "https://automated-accessibility-enhancer.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/app/, "") || "/";

  const forwarded = new Headers(request.headers);
  // Tells Flask it is mounted at /app, so url_for() builds /app/... links instead of
  // root-absolute ones this domain would answer with the landing page. The app reads it
  // through ProxyFix(x_prefix=1); without this header it serves itself at the root.
  forwarded.set("X-Forwarded-Prefix", "/app");

  const upstream = await fetch(ORIGIN + path + url.search, {
    method: request.method,
    headers: forwarded,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  // The app prefixes its own redirects now, so a relative Location is already correct and
  // must not be prefixed again. Only an absolute upstream URL needs mapping back.
  const headers = new Headers(upstream.headers);
  const location = headers.get("Location");
  if (location && location.startsWith(ORIGIN)) {
    headers.set("Location", location.slice(ORIGIN.length) || "/");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
