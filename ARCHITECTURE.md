# Touch ID Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (Browser)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    Login Page (login.tsx)                   │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │    │
│  │  │  Username   │  │   Password   │  │   Touch ID      │  │    │
│  │  │   Field     │  │    Field     │  │    Button       │  │    │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │    │
│  │         │                │                   │             │    │
│  │         └────────────────┴───────────────────┘             │    │
│  │                          │                                 │    │
│  └──────────────────────────┼─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │              Platform Detection (platform.ts)              │    │
│  │                                                             │    │
│  │  • isMacOS()                                               │    │
│  │  • isWebAuthnSupported()                                   │    │
│  │  • isPlatformAuthenticatorAvailable()                      │    │
│  │  • shouldOfferTouchID()                                    │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │            WebAuthn Service (webauthn.ts)                  │    │
│  │                                                             │    │
│  │  • registerCredential()                                    │    │
│  │  • authenticateWithTouchID()                               │    │
│  │  • hasStoredCredential()                                   │    │
│  │  • storeCredential()                                       │    │
│  │  • getStoredCredential()                                   │    │
│  │  • removeStoredCredential()                                │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │                 API Service (api.tsx)                      │    │
│  │                                                             │    │
│  │  • useLogin()                                              │    │
│  │  • useTouchIDLogin()                                       │    │
│  │  • useGetTouchIDChallenge()                                │    │
│  │  • useRegisterTouchID()                                    │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ HTTPS/JSON
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                         Backend (To Be Implemented)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   API Endpoints                            │    │
│  │                                                             │    │
│  │  POST /api/auth/touchid-challenge                          │    │
│  │  POST /api/auth/login/touchid                              │    │
│  │  POST /api/auth/register-touchid                           │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │              Challenge Management                          │    │
│  │                                                             │    │
│  │  • Generate random challenge                               │    │
│  │  • Store with expiration (Redis)                           │    │
│  │  • Validate challenge                                      │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │            Signature Verification                          │    │
│  │                                                             │    │
│  │  • Retrieve public key                                     │    │
│  │  • Verify signature                                        │    │
│  │  • Validate authenticator data                             │    │
│  │  • Update counter                                          │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                       │
│  ┌──────────────────────────▼─────────────────────────────────┐    │
│  │                    Database                                │    │
│  │                                                             │    │
│  │  • webauthn_credentials table                              │    │
│  │    - credential_id                                         │    │
│  │    - public_key                                            │    │
│  │    - counter                                               │    │
│  │    - user_id (FK)                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Touch ID Authentication Flow

```
┌─────────┐                ┌──────────┐              ┌─────────┐
│  User   │                │ Frontend │              │ Backend │
└────┬────┘                └────┬─────┘              └────┬────┘
     │                          │                         │
     │  1. Enter username       │                         │
     ├─────────────────────────>│                         │
     │                          │                         │
     │                          │ 2. Check platform       │
     │                          │    & stored credential  │
     │                          │                         │
     │  3. Show Touch ID button │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
     │  4. Click Touch ID       │                         │
     ├─────────────────────────>│                         │
     │                          │                         │
     │                          │ 5. Request challenge    │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │ 6. Return challenge     │
     │                          │<────────────────────────┤
     │                          │                         │
     │  7. Touch ID prompt      │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
     │  8. Scan fingerprint     │                         │
     ├─────────────────────────>│                         │
     │                          │                         │
     │                          │ 9. Generate signature   │
     │                          │                         │
     │                          │ 10. Send auth data      │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │ 11. Verify signature    │
     │                          │                         │
     │                          │ 12. Return JWT token    │
     │                          │<────────────────────────┤
     │                          │                         │
     │  13. Redirect to home    │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
```

## Component Hierarchy

```
LoginPage (login.tsx)
│
├── Form (React Hook Form)
│   │
│   ├── Username Field
│   │   └── Input
│   │
│   ├── Password Field
│   │   └── Input
│   │
│   ├── Touch ID Button (conditional)
│   │   ├── Fingerprint Icon
│   │   └── Spinner (loading state)
│   │
│   └── Login Button
│       └── Spinner (loading state)
│
└── Error Message (conditional)
```

## State Management

```javascript
// Login Page State
{
  // Form state (React Hook Form)
  username: string,
  password: string,
  
  // Touch ID state
  showTouchID: boolean,           // Show Touch ID button
  touchIDAvailable: boolean,      // Platform supports Touch ID
  isTouchIDAuthenticating: boolean, // Loading state
  touchIDError: string | null,    // Error message
}
```

## Storage Architecture

### Frontend (localStorage)
```
Key Format: webauthn_credential_${username}
Value: credentialId (base64url string)

Example:
webauthn_credential_user@example.com: "kH4w5rJ9..."
```

### Backend (Database)
```sql
webauthn_credentials
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users.id)
├── credential_id (UNIQUE, indexed)
├── public_key (TEXT)
├── counter (INTEGER)
├── created_at (TIMESTAMP)
└── last_used_at (TIMESTAMP)
```

### Backend (Redis - Challenges)
```
Key Format: webauthn:challenge:${email}
Value: challenge (base64url string)
TTL: 300 seconds (5 minutes)

Example:
webauthn:challenge:user@example.com: "xY2kP8..." (expires in 300s)
```

## Security Layers

```
┌────────────────────────────────────────────────────┐
│              Security Layer 1                      │
│         Platform Authenticator Required            │
│  (Touch ID hardware must be present and enabled)   │
└────────────────────────────────────────────────────┘
                      │
┌────────────────────────────────────────────────────┐
│              Security Layer 2                      │
│            User Verification Required              │
│     (User must verify with biometric/PIN)          │
└────────────────────────────────────────────────────┘
                      │
┌────────────────────────────────────────────────────┐
│              Security Layer 3                      │
│            Challenge-Response Auth                 │
│      (Prevents replay attacks with nonce)          │
└────────────────────────────────────────────────────┘
                      │
┌────────────────────────────────────────────────────┐
│              Security Layer 4                      │
│          Cryptographic Signature                   │
│    (Private key never leaves secure element)       │
└────────────────────────────────────────────────────┘
                      │
┌────────────────────────────────────────────────────┐
│              Security Layer 5                      │
│            Backend Verification                    │
│      (Public key signature verification)           │
└────────────────────────────────────────────────────┘
```

## Browser APIs Used

```
Navigator APIs:
├── navigator.userAgent          // Platform detection
├── navigator.platform           // Fallback detection
├── navigator.credentials        // WebAuthn API
│   ├── create()                // Register credential
│   └── get()                   // Authenticate
└── PublicKeyCredential          // WebAuthn interface
    └── isUserVerifyingPlatformAuthenticatorAvailable()
```

## Error Handling Flow

```
┌─────────────────────────┐
│   Touch ID Attempt      │
└───────────┬─────────────┘
            │
            ├── Username empty?
            │   └─> Show error: "Enter username first"
            │
            ├── Challenge request failed?
            │   └─> Show error: "Server error"
            │
            ├── No stored credential?
            │   └─> Show error: "No credential found"
            │
            ├── WebAuthn call failed?
            │   └─> Show error: "Touch ID failed/cancelled"
            │
            ├── Backend auth failed?
            │   └─> Show error: "Authentication failed"
            │
            └── Success
                └─> Navigate to /app/home
```

## Performance Considerations

```
Initial Page Load:
├── Check platform (synchronous, <1ms)
├── Check WebAuthn support (synchronous, <1ms)
└── Check platform authenticator (async, ~100ms)

On Username Change:
└── Check localStorage (synchronous, <1ms)

Touch ID Authentication:
├── Request challenge (network, ~200ms)
├── WebAuthn prompt (user interaction, 1-5s)
├── Generate signature (crypto, ~50ms)
└── Backend verification (network, ~200ms)

Total: ~500ms + user interaction time
```

## Dependencies

```
Frontend:
├── React 19.1.1
├── React Hook Form 7.65.0
├── Zod 4.1.12
├── TanStack Router 1.132.47
├── Lucide React 0.545.0
└── Web APIs (no npm packages)
    ├── PublicKeyCredential
    ├── navigator.credentials
    └── localStorage

Backend (Recommended):
└── @simplewebauthn/server (for Node.js)
```

## Future Architecture Extensions

```
┌────────────────────────────────────────┐
│       Post-Login Registration          │
│  (Prompt users to enroll Touch ID)     │
└────────────────────────────────────────┘
            │
┌────────────────────────────────────────┐
│      Settings Management Page          │
│  (View/remove Touch ID credentials)    │
└────────────────────────────────────────┘
            │
┌────────────────────────────────────────┐
│      Multi-Device Support              │
│  (Multiple credentials per user)       │
└────────────────────────────────────────┘
            │
┌────────────────────────────────────────┐
│       Credential Sync                  │
│  (Sync across user's devices)          │
└────────────────────────────────────────┘
```

## Deployment Architecture

```
Development:
├── localhost:5173 (Vite dev server)
└── WebAuthn requires HTTPS or localhost

Production:
├── CDN (Static files)
├── HTTPS required (WebAuthn requirement)
└── Same origin as API (CORS considerations)
```

## Testing Architecture

```
Unit Tests:
├── platform.ts functions
├── webauthn.ts functions
└── API methods

Integration Tests:
├── Login flow with mock WebAuthn
└── Error handling scenarios

E2E Tests:
├── Touch ID on macOS (real hardware)
├── Platform detection
└── Fallback scenarios
```

---

**Implementation Status:** ✅ Complete
**Backend Status:** ⏳ Pending implementation
**Documentation:** ✅ Complete
