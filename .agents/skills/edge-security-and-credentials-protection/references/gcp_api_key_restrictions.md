# Google Cloud Console Web API Key Lockdown Runbook

Step-by-step instructions to enforce infrastructure-level restrictions on Firebase Web API keys.

---

## 1. Why GCP Infrastructure Lockdown is Required
Firebase Web API keys are identifiers for public client SDKs. While Firestore Security Rules protect data, Google Cloud Console restrictions prevent unauthorized domains and scripts from calling APIs with your project credentials.

---

## 2. Step-by-Step Configuration Guide

1. Log into the **Google Cloud Console**:
   `https://console.cloud.google.com/apis/credentials?project=sachin-shakya-site`
2. Locate the Web API key (name: `Browser key` or matching `AIzaSyCn3ngUlrnCnUIWYXQ_xXXZikZvviFed40`).
3. Click **Edit API key**.
4. Under **Set application restrictions**:
   - Choose **Websites** (HTTP referrers).
   - Click **Add** and enter the following allowed referrer patterns:
     - `https://shakya.mukeshjena.com/*`
     - `https://*.mukeshjena.com/*`
     - `http://localhost:*`
     - `http://127.0.0.1:*`
5. Under **API restrictions**:
   - Choose **Restrict key**.
   - In the dropdown, select ONLY the services needed:
     - `Cloud Firestore API`
     - `Identity Toolkit API`
     - `Cloud Storage API`
6. Click **Save**.

---

## 3. Verification
Verify that external curl requests using this key are blocked:
```bash
curl -X POST "https://firestore.googleapis.com/v1/projects/sachin-shakya-site/databases/(default)/documents" \
  -H "Content-Type: application/json" \
  -d '{"fields": {}}'
# Expected response: 403 Forbidden / API_KEY_HTTP_REFERRER_BLOCKED
```
