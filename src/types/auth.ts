export interface Token {
  access_token: string
  token_type: string
}

export interface TokenPayload {
  sub: string
  exp?: number
}

export interface LoginRequest {
  username: string
  password: string
}
