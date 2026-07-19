import { createRemoteJWKSet, type JWTPayload, jwtVerify } from 'jose'

const DISCOVERY_URL = process.env.KEYCLOAK_DISCOVERY_URL!

// The httpOnly cookie set by the shared j26-auth service, carrying the Keycloak
// access token. Kept in sync with j26-auth/src/constants.ts.
export const ACCESS_TOKEN_COOKIE = 'j26-auth_access-token'

interface OpenIdConfiguration {
  issuer: string
  jwks_uri: string
}

let jwksConfigPromise:
  | Promise<{ issuer: string; jwks: ReturnType<typeof createRemoteJWKSet> }>
  | undefined

function getJwksConfig() {
  if (!jwksConfigPromise) {
    jwksConfigPromise = fetch(DISCOVERY_URL)
      .then((res) => res.json() as Promise<OpenIdConfiguration>)
      .then((config) => ({
        issuer: config.issuer,
        jwks: createRemoteJWKSet(new URL(config.jwks_uri)),
      }))
      .catch((err) => {
        jwksConfigPromise = undefined
        throw err
      })
  }
  return jwksConfigPromise
}

interface KeycloakPayload extends JWTPayload {
  resource_access?: {
    'j26-cms'?: {
      roles: string[]
    }
  }
  name?: string
  preferred_username?: string
  email?: string
}

export interface KeycloakUser {
  sub: string
  name: string
  email: string
  preferredUsername: string
  roles: string[]
}

/**
 * Verify a Keycloak access token against the auth service's JWKS and return the
 * user identity + j26-cms client roles from the claims. Returns null on any
 * failure (missing/invalid signature, wrong issuer, expired, etc.).
 */
export async function verifyAndGetUser(token: string): Promise<KeycloakUser | null> {
  try {
    const { issuer, jwks } = await getJwksConfig()
    const { payload } = await jwtVerify<KeycloakPayload>(token, jwks, { issuer })

    return {
      sub: payload.sub!,
      name: payload.name ?? 'Okänd',
      email: payload.email ?? '',
      preferredUsername: payload.preferred_username ?? '',
      roles: payload.resource_access?.['j26-cms']?.roles ?? [],
    }
  } catch (err) {
    console.error('[auth] verifyAndGetUser failed:', err)
    return null
  }
}

/** Pull a single cookie value out of a raw Cookie header string. */
export function getCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined

  for (const part of cookieHeader.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    if (part.slice(0, index).trim() === name) {
      return decodeURIComponent(part.slice(index + 1).trim())
    }
  }

  return undefined
}
