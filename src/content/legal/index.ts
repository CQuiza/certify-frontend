import eulaMarkdown from './eula-estudiantes.md?raw'
import termsMarkdown from './terminos-b2b.md?raw'

export type LegalDocId = 'terminos' | 'eula'

export interface LegalDoc {
  id: LegalDocId
  title: string
  shortTitle: string
  description: string
  version: string
  updatedAt: string
  markdown: string
}

export const EULA_VERSION = '2026-10-29'

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  terminos: {
    id: 'terminos',
    title: 'Términos y Condiciones de Uso',
    shortTitle: 'Términos y condiciones',
    description:
      'Condiciones bajo las cuales Formativa presta su infraestructura tecnológica a organizaciones y academias.',
    version: '2026-10-29',
    updatedAt: '29 de octubre de 2026',
    markdown: termsMarkdown,
  },
  eula: {
    id: 'eula',
    title: 'Acuerdo de Usuario Final y Política de Privacidad',
    shortTitle: 'Acuerdo de estudiantes',
    description:
      'Derechos y obligaciones de los estudiantes, tratamiento de datos personales y alcance de los certificados.',
    version: EULA_VERSION,
    updatedAt: '29 de octubre de 2026',
    markdown: eulaMarkdown,
  },
}

export function isLegalDocId(value: string | null): value is LegalDocId {
  return value === 'terminos' || value === 'eula'
}
