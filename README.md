# Loan Application Form

A responsive two-step loan application form built with React, TypeScript, and Tailwind CSS. The form features modern styling with orange and white color scheme and is designed for easy integration.

## Features

- **Two-Step Form Process**: Loan details and contact information
- **React Hook Form**: Modern form handling with validation
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling
- **Mobile Responsive**: Works perfectly on all devices
- **Form Validation**: Real-time validation with error messages
- **Modern UI**: Clean, professional design with orange/white theme

## Project Structure

```
src/
├── components/
│   ├── LoanDetailsStep.tsx      # Step 1: Loan details form
│   └── ContactInformationStep.tsx # Step 2: Contact information form
├── types/
│   └── loanForm.ts              # TypeScript type definitions
├── utils/
│   └── validation.ts            # Validation utilities
└── App.tsx                      # Main application component
```

## Form Components

### LoanDetailsStep
- Loan amount input (required, numeric)
- Loan type dropdown (Personal, Home, Car)
- Modern styling with icons and validation
- Consistent size for easy integration

### ContactInformationStep
- Full name input (required)
- Email address input (required, validated)
- Phone number input (required, validated)
- Back and submit buttons
- Same size as step 1 for consistency

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Usage

### Basic Form
The form is already set up in `App.tsx` with step navigation:

```tsx
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LoanDetailsStep } from './components/LoanDetailsStep';
import { ContactInformationStep } from './components/ContactInformationStep';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm();
  
  return (
    <FormProvider {...methods}>
      {currentStep === 1 ? (
        <LoanDetailsStep onNext={() => setCurrentStep(2)} />
      ) : (
        <ContactInformationStep onBack={() => setCurrentStep(1)} onSubmit={(data) => {}} />
      )}
    </FormProvider>
  );
}
```

### Individual Steps
You can also use the steps independently:

```tsx
import { FormProvider, useForm } from 'react-hook-form';
import { LoanDetailsStep } from './components/LoanDetailsStep';
import { ContactInformationStep } from './components/ContactInformationStep';

function MyComponent() {
  const methods = useForm();
  
  return (
    <FormProvider {...methods}>
      <LoanDetailsStep onNext={() => {}} />
      {/* or */}
      <ContactInformationStep onBack={() => {}} onSubmit={(data) => {}} />
    </FormProvider>
  );
}
```

## Form Data Structure

```typescript
interface LoanFormData {
  loanAmount: string;
  loanType: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}
```

## Validation Rules

- **Loan Amount**: Required, must be positive number
- **Loan Type**: Required, must select from dropdown
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, must be valid email format
- **Phone Number**: Required, must be valid phone format

## Styling

The form uses a modern orange and white color scheme:

- **Primary**: Orange gradient (`from-orange-500 to-orange-600`)
- **Background**: White with subtle shadows
- **Borders**: Gray with orange focus states
- **Error States**: Red borders and backgrounds
- **Success States**: Green accents

## Integration

The forms are designed for easy integration:

1. **Consistent Size**: Both steps have the same dimensions
2. **Responsive Design**: Works in any container
3. **Clean Styling**: Minimal design that fits any theme
4. **Form Validation**: Client-side validation with clear error messages

## Development

### Adding New Fields

1. Update the `LoanFormData` interface in `types/loanForm.ts`
2. Add validation rules in the component
3. Update the form's default values

### Customizing Styling

The form uses Tailwind CSS classes. To customize:

1. Modify the Tailwind config in `tailwind.config.js`
2. Update component className props
3. Add custom CSS in `src/index.css`

### Adding New Steps

1. Create a new step component
2. Add it to the step navigation logic in `App.tsx`
3. Update the form state management

## Build for Production

```bash
npm run build
```

The built files can be used as standalone components or integrated into other applications.

## License

MIT License - feel free to use in your projects.
