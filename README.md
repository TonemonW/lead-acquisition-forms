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
    main.tsx
    main-widget.tsx        # Library entry → exposes window.LeadFormWidget.mount
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
  vite.config.ts           # UMD build config (react & react-dom are external)
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

## Build the Widget
Produces `dist/lead-form-widget.js` (UMD format).
```bash
npm run build
```
The build is configured in `vite.config.ts`:
- Output file: `dist/lead-form-widget.js`
- Format: UMD
- Externals: `react`, `react-dom` (expected as globals `React`, `ReactDOM` in the host page)

## Embed in a Host Page
1. Ensure `React` and `ReactDOM` are available as globals in the host page (because they are marked as externals in the UMD build).
2. Include the widget bundle and mount it into a container.

Example host HTML:
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lead Form Widget Host</title>
    <!-- Provide React & ReactDOM as globals in your environment -->
    <!-- <script src="/path/to/react.global.js"></script> -->
    <!-- <script src="/path/to/react-dom.global.js"></script> -->

    <style>
      /* Optional container sizing */
      #lead-form-root { max-width: 420px; margin: 24px auto; }
    </style>
  </head>
  <body>
    <div id="lead-form-root"></div>

    <!-- The bundled widget built by `npm run build` -->
    <script src="/dist/lead-form-widget.js"></script>
    <script>
      // Mount the widget into a DOM selector
      window.LeadFormWidget.mount('#lead-form-root');
    </script>
  </body>
  </html>
```

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
  - Verify `VITE_FUNCTIONS_BASE_URL`, or ensure the host path `/submitLead` is reachable
- Validation blocking step transitions:
  - Check field values against the rules in `src/types/loanForm.ts`

## Scripts
- `npm run dev`: Start dev server
- `npm run build`: Type-check and build the widget bundle
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint

## License
MIT
