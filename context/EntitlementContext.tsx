import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type LicenseClass = 'member' | 'employee';

type EntitlementState = {
  memberAvailable: number;
  employeeAvailable: number;
};

type EntitlementContextValue = EntitlementState & {
  setAvailable: (licenseClass: LicenseClass, count: number) => void;
  consumeOne: (licenseClass: LicenseClass) => void;
  reset: () => void;
};

const initialState: EntitlementState = {
  memberAvailable: 0,
  employeeAvailable: 0,
};

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EntitlementState>(initialState);

  const value = useMemo<EntitlementContextValue>(
    () => ({
      ...state,
      setAvailable: (licenseClass, count) => {
        const normalized = Math.max(0, Math.floor(Number(count) || 0));
        setState((prev) =>
          licenseClass === 'member'
            ? { ...prev, memberAvailable: normalized }
            : { ...prev, employeeAvailable: normalized }
        );
      },
      consumeOne: (licenseClass) => {
        setState((prev) =>
          licenseClass === 'member'
            ? { ...prev, memberAvailable: Math.max(0, prev.memberAvailable - 1) }
            : { ...prev, employeeAvailable: Math.max(0, prev.employeeAvailable - 1) }
        );
      },
      reset: () => setState(initialState),
    }),
    [state]
  );

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlements(): EntitlementContextValue {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error('useEntitlements must be used within EntitlementProvider');
  }
  return context;
}
