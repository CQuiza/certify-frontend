import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

function apiOrigin(apiUrl: string | undefined): string | null {
  if (!apiUrl || !/^https?:\/\//i.test(apiUrl)) return null
  try {
    return new URL(apiUrl).origin
  } catch {
    return null
  }
}

function sentryOrigin(dsn: string | undefined): string | null {
  if (!dsn) return null
  try {
    return new URL(dsn).origin
  } catch {
    return null
  }
}

function buildCsp(
  isDev: boolean,
  apiUrl: string | undefined,
  sentryDsn: string | undefined,
): string {
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com"
    : "script-src 'self' https://challenges.cloudflare.com"
  const connectParts = ["'self'"]
  if (isDev) {
    connectParts.push('http://localhost:8000', 'ws://localhost:*')
  }
  const externalApi = apiOrigin(apiUrl)
  if (externalApi) connectParts.push(externalApi)
  const externalSentry = sentryOrigin(sentryDsn)
  if (externalSentry) connectParts.push(externalSentry)
  connectParts.push('https://challenges.cloudflare.com')

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: http: data: blob:",
    "media-src 'self' https: http: blob: data:",
    "frame-src https://www.youtube.com https://drive.google.com https://challenges.cloudflare.com blob:",
    "worker-src 'self' blob:",
    `connect-src ${connectParts.join(' ')}`,
    "form-action 'self'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ')
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const canUploadSourceMaps = Boolean(
    env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT,
  )

  const plugins: PluginOption[] = [
    react(),
    tailwindcss(),
    {
      name: 'inject-csp',
      transformIndexHtml(html) {
        return html.replace(
          '%CSP_CONTENT%',
          buildCsp(command === 'serve', env.VITE_API_URL, env.VITE_SENTRY_DSN),
        )
      },
    },
  ]

  if (canUploadSourceMaps) {
    plugins.push(
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        telemetry: false,
        sourcemaps: {
          filesToDeleteAfterUpload: ['./dist/**/*.map'],
        },
      }),
    )
  }

  return {
    plugins,
    build: {
      sourcemap: canUploadSourceMaps,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
