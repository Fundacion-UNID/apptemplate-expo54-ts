// context/OrgRegistryFormContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { OrgRegistrationForm } from '../forms/organization-registry-RJSF';

// --- Type Definitions ---

interface OrgRegistryFormContextValue {
  formData: Partial<OrgRegistrationForm>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<OrgRegistrationForm>>>;
}

// --- Context Creation ---

const OrgRegistryFormContext = createContext<OrgRegistryFormContextValue | undefined>(undefined);

// --- Provider Component ---

/**
 * Provides a dedicated global state for the multi-step Organization Registration form.
 */
export const OrgRegistryFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<Partial<OrgRegistrationForm>>({});
  const value = useMemo(() => ({ formData, setFormData }), [formData]);

  return (
    <OrgRegistryFormContext.Provider value={value}>
      {children}
    </OrgRegistryFormContext.Provider>
  );
};

// --- Custom Hook ---

/**
 * A custom hook to access the organization registration form data and its setter.
 */
export const useOrgRegistryForm = () => {
  const context = useContext(OrgRegistryFormContext);
  if (context === undefined) {
    throw new Error('useOrgRegistryForm must be used within an OrgRegistryFormProvider');
  }
  return context;
};

