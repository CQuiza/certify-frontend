export const config = {
  apiUrl:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.VITE_ROOT_DOMAIN ? '/api/v1' : 'http://localhost:8000/api/v1'),
  hideCoursesForAdmin: import.meta.env.VITE_HIDE_COURSES_FOR_ADMIN?.toLowerCase() === 'true',
  showTeacherRole: import.meta.env.VITE_SHOW_TEACHER_ROLE?.toLowerCase() === 'true',
  appName: import.meta.env.VITE_APP_NAME || 'Formativa',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Plataforma de Certificación',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+57 312 537 0218',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contacto@formativa.com',
  cityCountry: import.meta.env.VITE_CONTACT_CITY_COUNTRY || 'Bogotá, Colombia',
  rootDomain: import.meta.env.VITE_ROOT_DOMAIN || '',
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
  pricing: {
    currency: import.meta.env.VITE_PRICING_CURRENCY || 'COP',
    locale: import.meta.env.VITE_PRICING_LOCALE || 'es-CO',
    monthlyTotal: Number(import.meta.env.VITE_PRICING_MONTHLY_TOTAL) || 149000,
    semestralTotal: Number(import.meta.env.VITE_PRICING_SEMESTRAL_TOTAL) || 759900,
    annualTotal: Number(import.meta.env.VITE_PRICING_ANNUAL_TOTAL) || 1341000,
  },
} as const
