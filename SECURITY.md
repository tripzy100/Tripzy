# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Active development |

## Reporting a Vulnerability

We take the security of Tripzy Tours seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

### How to Report

Send an email to **security@tripzy.com** with the following details:

- Type of issue (e.g., SQL injection, XSS, privilege escalation)
- Full paths of source file(s) related to the issue
- Step-by-step reproduction instructions
- Proof-of-concept or exploit code (if any)
- Impact assessment

### What to Expect

- **Acknowledgment** within 48 hours of your report
- **Verification** of the vulnerability within 5 business days
- **Fix timeline** communicated after verification
- **Credit** in release notes if you wish

### Scope

- Production deployment at tripzy.com
- API endpoints
- Authentication and authorization
- Payment processing
- User data handling

### Out of Scope

- Third-party services (Supabase, Cloudinary, Cashfree, Vercel)
- Browser extensions
- Social engineering attacks

## Security Best Practices

1. Never commit `.env` files with real secrets
2. Use environment variables for all sensitive configuration
3. Run `npm audit` regularly and address high-severity issues
4. Keep all dependencies up to date
5. Use branch protection rules on `main` and `develop`
6. Require pull request reviews before merging
7. Log and monitor authentication attempts
8. Validate and sanitize all user inputs
