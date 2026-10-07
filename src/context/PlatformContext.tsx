import { createContext, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useBranding } from '../hooks/useConfiguration'
import { configurationService } from '../services/configurationService'

export interface PlatformContextValue {
  organizationName: string | null
  dashboardMessage: string | null
  hasCustomLogo: boolean
  logoUrl: string | null
  isLoading: boolean
}

export const PlatformContext = createContext<PlatformContextValue | undefined>(undefined)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useBranding({ enabled: isAuthenticated })

  const hasCustomLogo = isAuthenticated && !!data?.has_custom_logo

  return (
    <PlatformContext.Provider
      value={{
        organizationName: data?.organization_name ?? null,
        dashboardMessage: data?.dashboard_message ?? null,
        hasCustomLogo,
        logoUrl: hasCustomLogo ? configurationService.getLogoUrl() : null,
        isLoading,
      }}
    >
      {children}
    </PlatformContext.Provider>
  )
}