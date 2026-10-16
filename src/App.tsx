import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { PlatformProvider } from './context/PlatformContext'
import { CartProvider } from './context/CartContext'
import AppRouter from './AppRouter'
import ErrorBoundary from './components/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PlatformProvider>
            <CartProvider>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>
              <Toaster
                richColors
                closeButton
                position="bottom-right"
                offset={{ bottom: 96, right: 24 }}
                mobileOffset={{ bottom: 96, right: 16 }}
              />
            </CartProvider>
          </PlatformProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
