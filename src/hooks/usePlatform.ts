import { useContext } from 'react'
import { PlatformContext, type PlatformContextValue } from '../context/PlatformContext'

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform must be used within a PlatformProvider')
  return ctx
}