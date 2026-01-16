// context/AppTypeContext.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { createContext, useContext, useState, useMemo, ReactNode, FC } from 'react';

// --- Type Definitions ---

/**
 * @type AppType
 * @description Defines the possible states for the application type.
 * It can be 'family', 'organization', or null if not yet selected.
 */
type AppType = 'family' | 'organization' | null;

/**
 * @interface AppTypeContextType
 * @description Defines the shape of the context provided by AppTypeProvider.
 * This ensures type safety for any component consuming this context.
 */
interface AppTypeContextType {
  appType: AppType;
  setAppType: (type: AppType) => void; // Correctly typed to accept an argument
  resetAppType: () => void;
}

/**
 * @interface AppTypeProviderProps
 * @description Defines the props for the AppTypeProvider component.
 */
interface AppTypeProviderProps {
  children: ReactNode;
}

// --- Context Creation ---

/**
 * @description
 * Creates the context with a default value.
 * The default implementation for setAppType is a no-op function to prevent crashes
 * if a component accidentally uses the context without a provider.
 */
const AppTypeContext = createContext<AppTypeContextType>({
  appType: null,
  setAppType: () => {}, // Default empty function
  resetAppType: () => {},
});


// --- Provider Component ---

/**
 * @component AppTypeProvider
 * @description
 * This provider component manages the state of the application type (`family` or `organization`).
 * It wraps the part of the application that needs access to this shared state.
 *
 * @param {AppTypeProviderProps} { children } - The child components that will have access to this context.
 * @returns {React.FC} A provider component.
 */
export const AppTypeProvider: FC<AppTypeProviderProps> = ({ children }) => {
  const [appType, setAppType] = useState<AppType>(null);
  const resetAppType = () => setAppType(null);

  /**
   * @description
   * `useMemo` is used here to prevent the context value object from being recreated on every render,
   * which would cause unnecessary re-renders of all consumer components.
   */
  const value = useMemo(() => ({ appType, setAppType, resetAppType }), [appType]);

  return <AppTypeContext.Provider value={value}>{children}</AppTypeContext.Provider>;
};

// --- Custom Hook ---

/**
 * @hook useAppType
 * @description
 * A custom hook to easily consume the AppTypeContext in functional components.
 * It provides a clean and reusable way to access the `appType`, `setAppType`, and `resetAppType` values.
 *
 * @returns {AppTypeContextType} The context value.
 */
export const useAppType = () => useContext(AppTypeContext);
