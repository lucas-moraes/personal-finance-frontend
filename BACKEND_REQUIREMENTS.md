# Backend Requirements for Touch ID Login

This document outlines the backend API endpoints that need to be implemented to support Touch ID authentication.

## Required Endpoints

### 1. Get Touch ID Challenge
**Endpoint:** `POST /api/auth/touchid-challenge`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "challenge": "base64url-encoded-random-challenge"
}
```

**Description:**
- Generates a cryptographically random challenge (32 bytes recommended)
- Challenge should be stored temporarily (e.g., Redis with 5-minute expiration)
- Challenge should be base64url encoded
- Used to prevent replay attacks

### 2. Touch ID Login
**Endpoint:** `POST /api/auth/login/touchid`

**Request Body:**
```json
{
  "email": "user@example.com",
  "credentialId": "base64url-encoded-credential-id",
  "signature": "base64url-encoded-signature",
  "authenticatorData": "base64url-encoded-authenticator-data",
  "clientDataJSON": "base64url-encoded-client-data-json"
}
```

**Response:**
```json
{
  "token": "jwt-auth-token"
}
```

**Description:**
- Verifies the WebAuthn assertion
- Retrieves the stored public key for the credential
- Verifies the signature using the public key
- Validates the challenge matches what was sent
- Checks authenticator data and client data
- Returns JWT token on successful authentication

### 3. Register Touch ID (Future Enhancement)
**Endpoint:** `POST /api/auth/register-touchid`

**Request Body:**
```json
{
  "email": "user@example.com",
  "credentialId": "base64url-encoded-credential-id",
  "publicKey": "base64url-encoded-public-key"
}
```

**Response:**
```json
{
  "success": true
}
```

**Description:**
- Stores the Touch ID credential for a user
- Associates public key with user account
- Requires valid authentication token
- Used after traditional login to enable Touch ID for future logins

## Security Considerations

### Challenge Management
- Generate cryptographically secure random challenges
- Store challenges with short expiration (5 minutes recommended)
- One-time use only (delete after verification)
- Associate challenge with user email

### Signature Verification
1. Retrieve user's stored public key using credentialId
2. Decode base64url encoded fields
3. Construct verification data (authenticatorData + SHA256(clientDataJSON))
4. Verify signature using public key
5. Validate challenge in clientDataJSON matches stored challenge
6. Check authenticator data flags (user present, user verified)

### Public Key Storage
- Store public keys securely in database
- Associate with user account and credentialId
- Allow multiple credentials per user (different devices)
- Include metadata: creation date, last used, device info

### Rate Limiting
- Limit authentication attempts per user
- Prevent brute force attacks
- Implement exponential backoff on failures

## Implementation Libraries

### Node.js
- `@simplewebauthn/server` - Comprehensive WebAuthn library
- `fido2-lib` - FIDO2/WebAuthn library

### Python
- `webauthn` - WebAuthn library for Python

### Java
- `com.webauthn4j` - WebAuthn library for Java

## Example Verification Flow (Node.js with @simplewebauthn/server)

```javascript
const { verifyAuthenticationResponse } = require('@simplewebauthn/server');

async function verifyTouchIDLogin(req, res) {
  const { email, credentialId, signature, authenticatorData, clientDataJSON } = req.body;
  
  // Get stored challenge for this user
  const expectedChallenge = await getStoredChallenge(email);
  
  // Get user's stored credential
  const credential = await getCredential(email, credentialId);
  
  if (!credential) {
    return res.status(401).json({ error: 'Invalid credential' });
  }
  
  try {
    const verification = await verifyAuthenticationResponse({
      response: {
        id: credentialId,
        rawId: base64urlToBuffer(credentialId),
        response: {
          authenticatorData: base64urlToBuffer(authenticatorData),
          clientDataJSON: base64urlToBuffer(clientDataJSON),
          signature: base64urlToBuffer(signature),
        },
        type: 'public-key',
      },
      expectedChallenge,
      expectedOrigin: process.env.EXPECTED_ORIGIN,
      expectedRPID: process.env.RP_ID,
      authenticator: {
        credentialID: base64urlToBuffer(credentialId),
        credentialPublicKey: credential.publicKey,
        counter: credential.counter,
      },
    });
    
    if (verification.verified) {
      // Update counter
      await updateCredentialCounter(credentialId, verification.authenticationInfo.newCounter);
      
      // Generate JWT token
      const token = generateJWT(email);
      
      // Clear challenge
      await deleteChallenge(email);
      
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
```

## Database Schema

### Credentials Table
```sql
CREATE TABLE webauthn_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  credential_id VARCHAR(512) NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,
  device_info JSONB,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_webauthn_credentials_user_id ON webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_credentials_credential_id ON webauthn_credentials(credential_id);
```

### Challenges Table (Redis recommended)
```javascript
// Redis key format
const key = `webauthn:challenge:${email}`;
const challenge = generateRandomChallenge();
await redis.setex(key, 300, challenge); // 5 minute expiration
```

## Testing

### Test Cases
1. Valid authentication with correct credentials
2. Invalid signature
3. Expired challenge
4. Non-existent credential
5. Replay attack (reusing challenge)
6. Rate limiting
7. Concurrent authentication attempts

### Tools
- Use `@simplewebauthn/browser` for testing WebAuthn flows
- Mock WebAuthn API in tests
- Test with actual macOS devices when possible

## References
- [W3C WebAuthn Specification](https://www.w3.org/TR/webauthn-2/)
- [SimpleWebAuthn Documentation](https://simplewebauthn.dev/)
- [FIDO Alliance](https://fidoalliance.org/)
