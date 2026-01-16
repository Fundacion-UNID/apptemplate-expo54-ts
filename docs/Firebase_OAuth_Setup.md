# Firebase OAuth with Google Setup Guide

This document outlines the necessary steps to configure Google Sign-In for this project using Firebase Authentication. The process involves configuration across the local codebase, Google Cloud Platform, and the Firebase Console.

## Preamble: Secure Key Management

All client IDs and secrets **must not** be committed to the repository. This project uses an `app.config.ts` file that dynamically loads these keys from a `.env` file at the root of the project. The `.env` file is listed in `.gitignore` and must never be removed from it.

### `.env` File Structure
```
GOOGLE_API_ANDROID_CLIENT_ID="your-android-client-id"
GOOGLE_API_IOS_CLIENT_ID="your-ios-client-id"
GOOGLE_API_WEB_CLIENT_ID="your-web-client-id"
```

---

## Step-by-Step Configuration

### 1. Google Cloud Platform: OAuth Consent Screen

Before creating any credentials, you must configure the project's OAuth consent screen. This is what users see when they sign in.

1.  Navigate to the [Google Cloud OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent).
2.  Ensure you have the correct project selected.
3.  If not configured, you will be prompted to create it. Select **"External"** for the User Type.
4.  Fill in the required information:
    *   **App name:** The public name of your application.
    *   **User support email:** This is a mandatory field. If you don't want to use a personal email, create a Google Group (e.g., `support.project-name@googlegroups.com`) and select it from the dropdown. You may need to complete this setup with a personal email first, then create the group and come back to edit it.
    *   **Developer contact information:** Also mandatory.
5.  Save and continue through the "Scopes" screen (no special scopes needed for basic login).
6.  **Crucial:** On the **"Test users"** screen, add all Google accounts that will be used for testing while the app is in "testing" mode. Otherwise, those users will be blocked from logging in.

### 2. Google Cloud Platform: Create Web Client ID

This is the credential used by the Expo web application.

1.  Navigate to the [Google Cloud Credentials Page](https://console.cloud.google.com/apis/credentials).
2.  Click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**.
3.  Set the **"Application type"** to **"Web application"**.
4.  Give it a descriptive name (e.g., `Project Web Client`).
5.  Under **"Authorized JavaScript origins"**, add the URIs for local development:
    *   `http://localhost:8081`
6.  Under **"Authorized redirect URIs"**, add the same URIs:
    *   `http://localhost:8081`
7.  Click **"CREATE"**.
8.  A window will pop up with your new credentials. **Copy the "Client ID"** and paste it into your `.env` file as `GOOGLE_API_WEB_CLIENT_ID`.

### 3. Firebase Console: Enable Google Sign-In

This step connects your newly created Client ID to your Firebase project.

1.  Navigate to your Firebase project console.
2.  Go to **Authentication > Sign-in method**.
3.  Click **"Add new provider"** and select **Google**.
4.  **Enable** the provider.
5.  Paste the **Web Client ID** from the previous step into the "Web client ID" field. The "Web client secret" will often be populated automatically.
6.  Click **"Save"**.

### 4. Local Project: Restart

After updating the `.env` file, you must restart the development server to ensure `app.config.ts` loads the new values.

```bash
npx expo start
```

---

## Future Steps: Native App Configuration

For native Android and iOS apps, you will need to create separate OAuth Client IDs in the Google Cloud Console with the type "Android" and "iOS" respectively. The Android configuration will require providing the application's SHA-1 fingerprint. These client IDs will then be added to the `.env` file.

## Troubleshooting Common Local Errors

### Error: `ExpoMetroConfig.loadAsync is not a function`

This error typically appears after upgrading Expo versions or switching to a dynamic `app.config.ts`. It indicates a deep-seated caching issue or corrupted dependencies that a simple cache clear (`-c`) cannot fix.

The definitive solution is a **"scorched earth" reinstall** of all dependencies. Execute the following commands in order:

1.  **Clear Metro's cache from your system's temp directory:**
    ```bash
    rm -rf $TMPDIR/metro-*
    ```

2.  **Delete local project dependencies and the lock file:**
    ```bash
    rm -rf node_modules
    rm package-lock.json
    ```

3.  **Reinstall all packages from scratch:**
    ```bash
    npm install
    ```

4.  **Start the server with a final cache clear:**
    ```bash
    npx expo start -c
    ```

This sequence resolves most persistent local environment issues.