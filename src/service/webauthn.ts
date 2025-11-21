/**
 * WebAuthn service for Touch ID authentication
 * Handles credential registration and authentication using Web Authentication API
 */

/**
 * Converts a base64url string to ArrayBuffer
 */
function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Converts an ArrayBuffer to base64url string
 */
function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export interface RegistrationOptions {
  challenge: string;
  userId: string;
  userName: string;
  userDisplayName: string;
}

export interface AuthenticationOptions {
  challenge: string;
  credentialId?: string;
}

/**
 * Registers a new credential for Touch ID authentication
 * This should be called after successful traditional login
 */
export async function registerCredential(
  options: RegistrationOptions
): Promise<{ credentialId: string; publicKey: string } | null> {
  try {
    const challenge = base64urlToBuffer(options.challenge);
    const userId = new TextEncoder().encode(options.userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Personal Finance',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: options.userName,
          displayName: options.userDisplayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential;

    if (!credential) {
      return null;
    }

    const response = credential.response as AuthenticatorAttestationResponse;
    const publicKey = response.getPublicKey();
    
    return {
      credentialId: bufferToBase64url(credential.rawId),
      publicKey: bufferToBase64url(publicKey || new ArrayBuffer(0)),
    };
  } catch (error) {
    console.error('Error registering credential:', error);
    return null;
  }
}

/**
 * Authenticates using Touch ID
 * Returns the credential ID and signature that should be verified by the backend
 */
export async function authenticateWithTouchID(
  options: AuthenticationOptions
): Promise<{ credentialId: string; signature: string; authenticatorData: string; clientDataJSON: string } | null> {
  try {
    const challenge = base64urlToBuffer(options.challenge);
    
    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      rpId: window.location.hostname,
    };

    // If a specific credential ID is provided, only allow that credential
    if (options.credentialId) {
      publicKeyOptions.allowCredentials = [{
        id: base64urlToBuffer(options.credentialId),
        type: 'public-key',
        transports: ['internal'],
      }];
    }

    const credential = await navigator.credentials.get({
      publicKey: publicKeyOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return null;
    }

    const response = credential.response as AuthenticatorAssertionResponse;
    
    return {
      credentialId: bufferToBase64url(credential.rawId),
      signature: bufferToBase64url(response.signature),
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
    };
  } catch (error) {
    console.error('Error authenticating with Touch ID:', error);
    return null;
  }
}

/**
 * Checks if a credential is already registered for the current device
 * This is stored in localStorage for simplicity
 */
export function hasStoredCredential(username: string): boolean {
  const credentialId = localStorage.getItem(`webauthn_credential_${username}`);
  return credentialId !== null && credentialId !== '';
}

/**
 * Stores the credential ID for a username
 */
export function storeCredential(username: string, credentialId: string): void {
  localStorage.setItem(`webauthn_credential_${username}`, credentialId);
}

/**
 * Retrieves the stored credential ID for a username
 */
export function getStoredCredential(username: string): string | null {
  return localStorage.getItem(`webauthn_credential_${username}`);
}

/**
 * Removes the stored credential for a username
 */
export function removeStoredCredential(username: string): void {
  localStorage.removeItem(`webauthn_credential_${username}`);
}
