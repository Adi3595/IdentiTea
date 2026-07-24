# 06. Security

Security in IdentiTea is enforced at both the infrastructure boundary and the application runtime to protect sensitive career data and PII.

## 1. Authentication Identity
- **Firebase Auth SDK**: Handled purely on the edge/client. Passwords never touch our backend servers.
- **Stateless JWTs**: Sessions are maintained statelessly via signed JWTs provided by Firebase.
- **Local Verification**: The FastAPI backend uses the Firebase Admin SDK to cryptographically verify JWTs locally (`core/auth.py`), preventing spoofing, tampering, and man-in-the-middle attacks without requiring a network round-trip.

## 2. API & Network Protection
- **Rate Limiting**: `slowapi` is implemented globally across the FastAPI router.
  - Standard endpoints: 100 requests per minute per IP.
  - Health/Public endpoints: 5 requests per minute per IP (to prevent DDoS on compute-heavy routes).
- **Security Headers Middleware**: Custom FastAPI middleware injects:
  - `Strict-Transport-Security` (HSTS)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (Prevent Clickjacking)
  - `Content-Security-Policy`

## 3. Data & File Security
- **Document Restrictions**: The upload endpoint strictly validates MIME types (`application/pdf`, `image/png`, `image/jpeg`) and limits sizes to 5MB natively in memory before processing.
- **Storage**: Documents are NEVER served statically from the backend. They are uploaded to Supabase Storage, which generates short-lived, signed URLs to prevent unauthorized hotlinking or scraping of user data.
- **Audit Logging**: All mutation requests (POST/PUT/DELETE) trigger an asynchronous background task that logs the user ID, action, IP, and timestamp into a PostgreSQL audit table for compliance tracking.
