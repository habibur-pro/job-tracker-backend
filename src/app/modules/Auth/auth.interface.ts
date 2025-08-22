export interface IAutoSignInPayload {
    provider: 'google' | 'github'
    type: 'oauth'
    providerAccountId: string
    access_token: string
    expires_at: number
    scope: string
    token_type: 'Bearer'
    id_token: string
}
