# Sign-in setup (Supabase)

Crystal requires an email account. Code: `app/sign-in.tsx`,
`store/useAuthStore.ts`, the gate in `app/_layout.tsx`, and
`lib/authLinking.ts` + `app/auth-callback.tsx` for email links on phones.

How it works: one email box for everyone. Supabase emails a one-time code
(code only, no link: a link and code share one token, and email scanners
that pre-open links were using it up). New emails get a new account. Known emails
sign into the existing account with its history. A device that still has an
old guest session gets its email attached to that guest account, so its
entries carry over; if that email already has an account, it signs into that
one and the guest entries stay behind.

## Settings to check in the Supabase dashboard

1. **Email templates** (Authentication → Emails → Templates): **Magic link
   or OTP**, **Confirm sign up**, **Change email address** show
   `{{ .Token }}` and no `{{ .ConfirmationURL }}` link. (Done 2026-11-27.)
2. **Redirect URLs** (Authentication → URL Configuration). Site URL should be
   the live web app. Add:
   - `crystal://auth-callback` (the iPhone app)
   - `exp://**` (Expo Go while testing)
3. **Email provider** (Authentication → Sign In / Providers → Email): Email
   on; "Confirm email" on.
4. **Anonymous sign-ins**: the app no longer creates guest accounts. You can
   turn this off once you're sure no one still has a guest session they care
   about. Old guest sessions keep working until then.
5. **Email sending limit**: Supabase's built-in email sender only allows a
   few emails per hour and is meant for testing. Before real users, set up
   custom SMTP (Authentication → Emails → SMTP Settings), e.g. with Resend.
