# Elite Omar - Haute Joaillerie

A luxurious, high-performance static jewelry e-commerce platform crafted with JAMstack principles.

## Tech Stack
*   **Frontend:** Vanilla JavaScript, HTML5
*   **Styling:** Tailwind CSS v4 (via CDN)
*   **Architecture:** Modular file structure (`index.html`, `js/app.js`, `js/canvas.js`, `css/styles.css`, `db/products.js`)

## Security & Architecture Highlights
*   **State Management:** The product database (`db/products.js`) utilizes `Object.freeze()` to guarantee client-side immutability and prevent price tampering via DevTools.
*   **XSS Mitigation:** Strict URL encoding using `encodeURIComponent` when building WhatsApp payloads prevents malicious injection.
*   **Clickjacking & Framing:** Enforced by `X-Frame-Options: DENY` via deployment headers.
*   **Reverse Tabnabbing:** Blocked using `noopener,noreferrer` when opening the WhatsApp checkout.
*   **CSP:** A restrictive Content-Security-Policy is established via `vercel.json` and `_headers` to limit executed scripts and external resources.

## Deployment
This project is configured for instantaneous deployment on platforms like Vercel and Cloudflare Pages.

### Vercel
The included `vercel.json` applies strict security headers globally.

### Cloudflare Pages
The included `_headers` file provides identical security rules for Cloudflare edges.

## Run Locally
1. Start a local server: `python -m http.server 8080`
2. Open your browser: `http://localhost:8080`
