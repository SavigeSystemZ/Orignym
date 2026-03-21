# Orignym - Security Model

## 1. Authentication & Authorization
- **Auth:** All user sessions are managed securely (via Auth.js or Clerk).
- **RBAC:** Strict Role-Based Access Control separates regular users from administrators. Only admins can access moderation queues and execute state changes on other users' claims.

## 2. Data Protection
- **PII:** User profile data is stored securely. Passwords are not stored directly if using a modern identity provider.
- **Input Validation:** All user inputs (especially proposed terms and intended meanings) are sanitized to prevent SQL injection and XSS.

## 3. AI Security
- **Prompt Injection:** User-provided text passed to AI models must be strictly scoped within grounded prompts to prevent injection attacks.
- **API Keys:** AI provider keys are stored in environment variables, never committed to source control.

## 4. Rate Limiting
- Endpoints for claim creation and verification are aggressively rate-limited to prevent automated spam and abuse of AI provider credits.