## Lead Acquisition Forms (Frontend + Backend + Database)

A lightweight, two-step lead form widget/iframe (React + Vite) with a Firebase Functions backend and Firestore Database.

### Requirements
- Node 20 (frontend, backend)

### Installation
- Install all workspace dependencies at the repo root:
  ```bash
  npm i
  ```

### Root npm scripts (run at repo root)
- `npm run build:shared`: build shared Zod schema for backend use
- `npm run build:frontend`: build widget UMD and iframe 
- `npm run build:backend`: build backend (runs build:shared first)
- `npm run dev:frontend`: start Vite dev server for the frontend forms
- `npm run dev:backend`: start Firebase Functions emulator
- `npm run deploy:backend`: deploy Firebase Functions only
- `npm run lint`: lint frontend and backend
- `npm run test -w frontend`: run frontend unit tests (Vitest)

## Project Structure
```
lead-acquisition-forms/
  Demo                        # Demo pages for UMD and iframe
  frontend/                
    src/
      App.tsx
      main.tsx                # Local environment entry
      main-widget.tsx         # UMD entry (window.LeadFormWidget)
      components/             # Two-step form + basic UI primitives
        LoanDetailsStep.tsx
        ContactInformationStep.tsx
        ui/ (button, input, select, label, icon)
        ui/button.test        # Button unit test (Vitest)
      services/api.ts         # submitLead(payload)
      iframe/index.html       # Iframe page
    public/
      widget/                 # UMD output (build)
      iframe/                 # Iframe output (build)
    vite.config.*.ts
  backend/                    # Firebase Functions (Cloud Functions)
    src/
      index.ts                # onRequest HTTP function (submitLead)
      handlers/leadHandler.ts # Validate & persist, Salesforce push
      services/(firestoreService.ts, salesforceService.ts)
    types/loanForm.js         # Built schema from shared (runtime JS)
    firebase.json, .firebaserc
  shared/                     # Zod schema shared by FE/BE
    types/loanForm.ts
  vercel.json                 # deploy frontend/public on Vercel
  Dockerfile, .dockerignore   # optional containerization (frontend)
```



## Frontend (Widget + Iframe)
- Features
  - Two-step form: Loan details → Contact information
  - Full accessibility: labels, `aria-invalid`, `aria-describedby`, live region for step changes, focus management to first invalid field
  - Validation with Zod via `@hookform/resolvers`
  - Data normalization: Loan Amount strips non-digits and leading zeros; Phone strips spaces/non-digits, removes `+61`/`61` or leading `0`
  - Failure handling: shows an inline error and focuses the erroneous input
  - Success feedback: after a successful backend submit, the button indicates success

- Dev
  - `npm run dev:frontend`
- Build widget (UMD) and iframe
  - `npm run build:frontend` → outputs to `frontend/public/widget/` and `frontend/public/iframe/`
- API base URL
  - `VITE_FUNCTIONS_BASE_URL` from deployed Firebase Function
- Tests
  - `npm run test -w frontend` (Vitest + Testing Library)

- Examples
  - Widget (UMD)
    ```html
    <div id="lead-form-root"></div>
    <link rel="stylesheet" href="/widget/lead-acquisition-forms.css" />
    <script>window.process = { env: { NODE_ENV: 'production' } };</script>
    <script src="/widget/lead-form-widget.js"></script>
    <script>window.LeadFormWidget.mount('#lead-form-root');</script>
    ```
  - Iframe
    ```html
    <iframe
      src="/iframe/index.html"
      title="Lead Form"
      style="width: 420px; height: 660px; border: 0;"
      loading="lazy"
    ></iframe>
    ```

## Backend (Firebase Functions)
- Features
  - Runtime: Node 20; HTTPS onRequest with CORS `*` (region: `australia-southeast1`)
  - Endpoint: `POST /submitLead`
  - Validation & processing: validates with shared Zod schema; normalizes phone (strip non-digits and drop `+61/61/0`) and amount (digits-only)
  - Persistence: writes to Firestore collection `leads` with `createdAt`
  - Integrations: forwards valid leads to Salesforce CRM when configured
  - Response contract:
    - 200: `{ id, message: 'Write successful' }` – returns an id for subsequent operations and querying the corresponding data
    - 400: `{ error: 'data_validation_failed', details: { field: message } }`
    - 405: `{ error: 'Method Not Allowed' }`
    - 500: `{ error: 'firestore_write_failed', details }` or `{ error: 'Internal server error' }`

- Prerequisites
  - Install Firebase CLI: `npm i -g firebase-tools`
  - Login: `firebase login`
  - Select project: `firebase projects:list` then `firebase use <projectId>` (or update `backend/.firebaserc`)
  - Configure environment (recommended via Firebase/Secret Manager):
    - `SALESFORCE_ENDPOINT`
    - `SALESFORCE_TOKEN`

- Local
  - `npm run dev:backend` (emulator)
- Deploy
  - `npm run deploy:backend`
- Env (set via .env or Firebase config)
  - `SALESFORCE_ENDPOINT`, `SALESFORCE_TOKEN`

## Shared Types (Zod)
- Source: `shared/types/loanForm.ts`
- Frontend imports: `@lead/shared/types/loanForm`
- Backend runtime imports: compiled JS at `backend/types/loanForm.js`
- Build shared first: `npm run build:shared`

## Accessibility
- Live region announces step changes
- Inputs wired with `aria-invalid` and `aria-describedby` for inline error messaging
- First invalid field is focused on invalid submit

## To Do (Due to limited time)
- Add Firestore security rules and CI validation
- Expand unit test coverage across all frontend and backend components/modules
- Add E2E tests (Playwright or Cypress) to validate the full flow
- Provide production-grade Docker workflows to serve both frontend and backend services

## License
MIT
