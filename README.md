# Lead Acquisition Forms (Widget)

A lightweight, two-step lead form built with React, Vite, React Hook Form, and Zod. It can be embedded as a widget into any host page and posts leads to a configurable backend endpoint.

## Features
- Two steps: Loan details → Contact information
- Validation powered by Zod via `@hookform/resolvers`
- Accessible form semantics (`aria-*`, required fields, error messaging)
- Small UI primitives (`Button`, `Input`, `Select`, `Label`) and reusable icons
- Packaged as a UMD library exposing a global `LeadFormWidget` with a `mount(selector)` API

## Tech Stack
- React 19, React DOM
- Vite (library mode)
- React Hook Form 7
- Zod, `@hookform/resolvers`
- Tailwind CSS (utility classes)
- Axios for HTTP (frontend)

## Project Structure
```
lead-acquisition-forms/
  src/
    App.tsx
    main.tsx               # Local test entry
    main-widget.tsx        # Library entry 
    components/
      LoanDetailsStep.tsx    
      ContactInformationStep.tsx
      ui/
        button.tsx
        input.tsx
        select.tsx
        label.tsx
        icon.tsx
    services/
      api.ts               # submitLead(payload)
    types/
      loanForm.ts          # Zod schema & types
  functions/               # Firebase Cloud Functions (backend)
    src/
      index.ts             # onRequest HTTP function (submitLead)
      handlers/
        leadHandler.ts     # request validation 
      services/
        firestoreService.ts# Firestore write helper
        salesforceService.ts# push data to Salesforce CRM
    package.json           
  vite.config.widget.ts    # UMD build config 
  vite.config.iframe.ts    # Iframe dev/build config for local embedding demo
```

Key files:
- `src/types/loanForm.ts`: Zod schema (`loanFormSchema`) and `loanTypeEnum`
- `src/App.tsx`: Form provider + step flow
- `src/components/LoanDetailsStep.tsx`, `src/components/ContactInformationStep.tsx`: Steps
- `src/services/api.ts`: `submitLead` implementation
- `src/main-widget.tsx`: Widget entry (`window.LeadFormWidget.mount`)

## Getting Started (Development)
1. Install dependencies
   ```bash
   npm install
   ```
2. Start dev server
   ```bash
   npm run dev
   ```
3. Open the local preview (served by Vite). For the embedded widget build, see the next section.

Linting:
```bash
npm run lint
```

## Build the Widget (UMD)
Produces `public/widget/lead-form-widget.js` (+ extracted CSS `public/widget/lead-acquisition-forms.css`).
```bash
npm run build:widget
```
The build is configured in `vite.config.widget.ts`:
- Output: `public/widget/lead-form-widget.js`
- Format: UMD
- CSS is emitted as a separate file (link it in the host page)

## Embed in a Host Page (UMD)
1. Ensure `React` and `ReactDOM` are available as globals in the host page (UMD externals)
2. Include the emitted CSS and JS, then call `LeadFormWidget.mount()`

Example host HTML:
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lead Form Widget Host</title>
    <style>
      /* Optional container sizing */
      #lead-form-root { max-width: 420px; margin: 24px auto; }
    </style>
  </head>
  <body>
    <div id="lead-form-root"></div>
    
    <script>window.process = { env: { NODE_ENV: 'production' } };</script>

    <!-- Widget CSS & JS built by `npm run build:widget` -->
    <link rel="stylesheet" href="/widget/lead-acquisition-forms.css" />
    <script src="/widget/lead-form-widget.js"></script>
    <script>
      // Mount the widget into a DOM selector
      window.LeadFormWidget.mount('#lead-form-root');
    </script>
  </body>
  </html>
```

## Iframe Demo (local development)
We provide an iframe page to demo/embed the UMD bundle locally.

Dev:
```bash
npm run dev:iframe
```
- Serves `src/iframe/index.html` with `publicDir` mapped to the project `public/`
- Ensure you have built the widget first:
  ```bash
  npm run build:widget
  ```

Build (optional):
```bash
npm run build:iframe
```
By default, the iframe build writes to `public/iframe/`. You can disable copying `public/` into that folder by setting `copyPublicDir: false` if desired.

Global API exposed by the bundle:
```ts
// window.LeadFormWidget (see src/main-widget.tsx)
interface LeadFormWidget {
  mount: (selector: string) => void;
}
```

## Backend Endpoint Configuration
The form posts leads as JSON to `VITE_FUNCTIONS_BASE_URL` if set, otherwise to `/submitLead`.
- Configure the base URL via Vite env (at build time):
  ```bash
  # .env or environment
  VITE_FUNCTIONS_BASE_URL=https://your-cloud-function.example.com/submitLead
  ```
- See `src/services/api.ts` for request details.

Payload shape (`SubmitLeadPayload`):
```ts
{
  fullName: string;
  email: string;
  phoneNumber: string; // includes "+61" prefix when sent
  loanType: string;
  loanAmount: string;
}
```

## Cloud Functions (Backend)

Overview:
- Runtime: Node 20, Firebase Functions v2 (HTTPS onRequest)
- Single HTTP endpoint: `submitLead` (region: `australia-southeast1`), CORS `*`
- Basic checks: method must be POST; required fields presence validation
- Persists to Firestore collection `leads` with `createdAt` server timestamp

Key files:
- `functions/src/index.ts`: exports the HTTPS function with CORS enabled
- `functions/src/handlers/leadHandler.ts`: method/field validation, error handling, calls Firestore
- `functions/src/services/firestoreService.ts`: initializes Admin SDK and writes lead document

Local development (Functions):
```bash
cd functions
npm install
npm run serve     # builds then starts the Functions emulator (functions only)
# Copy the printed local URL of submitLead and set it for the widget build/run
# Example: VITE_FUNCTIONS_BASE_URL=http://127.0.0.1:5001/<project-id>/australia-southeast1/submitLead
```

Deploy (requires Firebase project configured):
```bash
cd functions
npm run deploy
```

Logs:
```bash
cd functions
npm run logs
```

Request/Response contract (server):
- Request: `POST` JSON body `{ fullName, email, phoneNumber, loanType, loanAmount }`
- Responses:
  - 200 `{ message: 'Lead submitted successfully' }`
  - 400 `{ error: 'Missing required fields', received: { ...booleans } }`
  - 405 `{ error: 'Method Not Allowed' }`
  - 500 `{ error: 'firestore_write_failed', details }` or `{ error: 'Internal server error', details? }`

Notes:
- Frontend timeout is 15s (`src/services/api.ts`). Surface server error messages if needed.
- Consider enhancing server-side validation (email/phone format), rate limiting, and spam protection as follow-ups.

## Validation Rules (Zod)
Defined in `src/types/loanForm.ts`:
- `loanAmount`: string of digits, > 0
- `loanType`: one of `loanTypeEnum` (empty string treated as unselected)
- `fullName`: min length 2
- `email`: must be a valid email
- `phoneNumber`: exactly 9 digits (UI displays "+61" prefix, only digits stored)

## Accessibility
- Labels are associated via `htmlFor`
- Error messages are rendered near fields and set `aria-invalid` appropriately
- Purely decorative elements are marked `aria-hidden`

## Notes on Styling
- The form uses Tailwind utility classes embedded in the components
- Base styles are encapsulated in small UI components (`Button`, `Input`, `Select`, `Label`)

## Troubleshooting
- Blank screen or console error about `React`/`ReactDOM` not found:
  - Ensure the host page provides global `React` and `ReactDOM` before loading `lead-form-widget.js`
- Network errors on submit:
  - Verify `VITE_FUNCTIONS_BASE_URL`
- Validation blocking step transitions:
  - Check field values against the rules in `src/types/loanForm.ts`

## Scripts
- `npm run dev`: Start dev server
- `npm run build`: Type-check and build the widget bundle
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint

## License
MIT
