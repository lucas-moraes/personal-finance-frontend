/**
 * Detects if the user is accessing from a macOS device
 * @returns true if the platform is macOS, false otherwise
 */
export function isMacOS(): boolean {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Checks if Web Authentication API (WebAuthn) is available in the browser
 * This is required for Touch ID and other biometric authentication
 * @returns true if WebAuthn is supported, false otherwise
 */
export function isWebAuthnSupported(): boolean {
  return window.PublicKeyCredential !== undefined && 
         navigator.credentials !== undefined;
}

/**
 * Checks if the device supports platform authenticator (Touch ID, Face ID, Windows Hello)
 * @returns Promise that resolves to true if platform authenticator is available
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking platform authenticator availability:', error);
    return false;
  }
}

/**
 * Checks if Touch ID should be offered to the user
 * Combines macOS detection with WebAuthn support and platform authenticator availability
 * @returns Promise that resolves to true if Touch ID should be shown
 */
export async function shouldOfferTouchID(): Promise<boolean> {
  if (!isMacOS()) {
    return false;
  }
  
  return await isPlatformAuthenticatorAvailable();
}
