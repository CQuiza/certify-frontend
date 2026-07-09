export const SPECIAL_CHARS = '!@#$%^&*()-_=+'

export interface PasswordRule {
  key: string
  label: string
  validate: (pw: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  { key: 'minLength', label: 'Al menos 8 caracteres', validate: (pw) => pw.length >= 8 },
  { key: 'uppercase', label: 'Al menos una mayúscula', validate: (pw) => /[A-Z]/.test(pw) },
  { key: 'lowercase', label: 'Al menos una minúscula', validate: (pw) => /[a-z]/.test(pw) },
  { key: 'digit', label: 'Al menos un número', validate: (pw) => /\d/.test(pw) },
  { key: 'special', label: `Al menos un especial (${SPECIAL_CHARS})`, validate: (pw) => new RegExp(`[${SPECIAL_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(pw) },
]

export function validatePassword(password: string): string[] {
  return PASSWORD_RULES.filter((r) => !r.validate(password)).map((r) => r.label)
}

export function generateSecurePassword(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + SPECIAL_CHARS
  const pw = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)],
    'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)],
    '0123456789'[Math.floor(Math.random() * 10)],
    SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)],
  ]
  for (let i = 0; i < length - 4; i++) {
    pw.push(chars[Math.floor(Math.random() * chars.length)])
  }
  for (let i = pw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pw[i], pw[j]] = [pw[j], pw[i]]
  }
  return pw.join('')
}
