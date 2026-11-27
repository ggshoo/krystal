# Shipping crystal to iPhone

Crystal is one Expo codebase. The website builds from it on Vercel; the iPhone
app builds from it on EAS (Expo's cloud build service). Pushing to `main`
still only deploys the website. Phone builds happen when you run `eas build`.

## What's set up in the repo

- `assets/` holds the app icon, splash and favicon, rendered from the grape in
  `components/GrapeCompanion.tsx`. To redo them, change the grape and re-render.
- `app.json` has the icon, splash (light and dusk versions), bundle ID
  `com.gigihsu.crystal`, and `usesNonExemptEncryption: false` so App Store
  Connect doesn't ask the export-compliance question on every build.
  iPad support is off for now, so the store only needs iPhone screenshots.
- `eas.json` has three build profiles:
  - `development`: a dev build you can live-reload against your laptop
  - `preview`: an installable test build for your own phone
  - `production`: the build that goes to TestFlight and the App Store.
    Build numbers go up on their own.
- Analytics: `lib/posthogClient.ts` (web) and `lib/posthogClient.native.ts`
  (phone). Same events, same PostHog project. Filter by `$os` to split them.
- Email upgrade on phones: `lib/authLinking.ts` + `app/auth-callback.tsx`.

## One-time setup (Gigi)

1. **Apple Developer Program**: enroll at developer.apple.com ($99/year).
   Approval can take a day or two.
2. **Expo CLI**: `npm install -g eas-cli`, then `eas login` and, in this
   folder, `eas init` (links the project to your Expo account and writes the
   project ID into `app.json`; commit that change).
3. **Env vars on EAS**: the phone build doesn't read your local `.env` or
   Vercel's settings. Add them for the `preview` and `production`
   environments, either at expo.dev → project → Environment variables, or:
   ```
   eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value <url> --environment preview --environment production --visibility plaintext
   eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <key> --environment preview --environment production --visibility plaintext
   eas env:create --name EXPO_PUBLIC_POSTHOG_API_KEY --value <key> --environment preview --environment production --visibility plaintext
   ```
4. **Supabase redirect URL**: Dashboard → Authentication → URL Configuration
   → Redirect URLs → add `crystal://auth-callback`. Without it, the email
   link falls back to the website.

## Getting it on your phone (TestFlight)

```
eas build --platform ios --profile production
eas submit --platform ios --latest
```

The first build asks to sign in with your Apple ID and offers to create the
certificates for you. Say yes. `eas submit` creates the app in App Store
Connect if it doesn't exist. About 10 to 30 minutes later it shows up in
TestFlight; install the TestFlight app on your iPhone to get it.

## Before submitting for App Store review

- Privacy policy URL (a page on gigihsu.com is fine)
- App Privacy answers in App Store Connect: Crystal stores emotional
  check-ins and journal text tied to an account ID, and sends usage events
  to PostHog
- iPhone screenshots (6.9" size; take them from a TestFlight build)
- Short description, keywords, support URL, age rating
