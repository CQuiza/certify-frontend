import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function apiOrigin(apiUrl: string | undefined): string | null {
  if (!apiUrl || !/^https?:\/\//i.test(apiUrl)) return null
  try {
    return new URL(apiUrl).origin
  } catch {
    return null
  }
}

function buildCsp(isDev: boolean, apiUrl: string | undefined): string {
  const scriptSrc = isDev ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'"
  const connectParts = ["'self'"]
  if (isDev) {
    connectParts.push('http://localhost:8000', 'ws://localhost:*')
  }
  const externalApi = apiOrigin(apiUrl)
  if (externalApi) connectParts.push(externalApi)

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: http: data: blob:",
    "media-src 'self' https: http: blob: data:",
    "frame-src https://www.youtube.com https://drive.google.com blob:",
    `connect-src ${connectParts.join(' ')}`,
    "form-action 'self'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ')
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-csp',
        transformIndexHtml(html) {
          return html.replace(
            '%CSP_CONTENT%',
            buildCsp(command === 'serve', env.VITE_API_URL),
          )
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
