// context/SubjectContext.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { createContext, useContext, useState, useMemo, ReactNode, FC } from 'react';

/**
 * @interface SubjectContextType
 * @description
 * Defines the shape of the Subject Context. This context is the central point
 * for managing the application's current operational context, i.e., the "subject"
 * on whose behalf the user is acting.
 *
 * This is critical in an application where a user (e.g., a doctor) can switch
 * between different operational contexts (e.g., Patient A, Patient B, the Organization itself).
 *
 * @property {string | null} subjectId - The unique identifier of the current subject (e.g., patient ID, organization DID).
 * @property {string | null} accessToken - The bearer token associated with the current subject's session.
 * @property {(subjectId: string | null, accessToken: string | null) => void} setSubject - Function to set or clear the current subject context.
 */
interface SubjectContextType {
  subjectId: string | null;
  accessToken: string | null;
  familyId?: string | null;
  subjectDid?: string | null;
  subjectVaultId?: string | null;
  setSubject: (subjectId: string | null, accessToken: string | null) => void;
  setSubjectContext: (params: {
    familyId?: string | null;
    subjectDid?: string | null;
    subjectVaultId?: string | null;
  }) => void;
}

// Create the context with a default value.
const SubjectContext = createContext<SubjectContextType>({
  subjectId: null,
  accessToken: null,
  familyId: null,
  subjectDid: null,
  subjectVaultId: null,
  setSubject: () => {},
  setSubjectContext: () => {},
});

/**
 * @component SubjectProvider
 * @description
 * A provider component that wraps the application and makes the Subject Context
 * available to all child components. It manages the state of the current subject.
 */
export const SubjectProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [subjectDid, setSubjectDid] = useState<string | null>(null);
  const [subjectVaultId, setSubjectVaultId] = useState<string | null>(null);

  const setSubject = (newSubjectId: string | null, newAccessToken: string | null) => {
    setSubjectId(newSubjectId);
    setAccessToken(newAccessToken);
    console.log(`[SubjectContext] Switched context. Subject ID: ${newSubjectId}`);
  };

  const setSubjectContext = ({
    familyId: nextFamilyId,
    subjectDid: nextSubjectDid,
    subjectVaultId: nextSubjectVaultId,
  }: {
    familyId?: string | null;
    subjectDid?: string | null;
    subjectVaultId?: string | null;
  }) => {
    if (typeof nextFamilyId !== 'undefined') setFamilyId(nextFamilyId);
    if (typeof nextSubjectDid !== 'undefined') setSubjectDid(nextSubjectDid);
    if (typeof nextSubjectVaultId !== 'undefined') setSubjectVaultId(nextSubjectVaultId);
    console.log(`[SubjectContext] Switched family/subject context. familyId=${nextFamilyId} subjectDid=${nextSubjectDid}`);
  };

  const value = useMemo(
    () => ({
      subjectId,
      accessToken,
      familyId,
      subjectDid,
      subjectVaultId,
      setSubject,
      setSubjectContext,
    }),
    [subjectId, accessToken, familyId, subjectDid, subjectVaultId]
  );

  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  );
};

/**
 * @hook useSubject
 * @description
 * A custom hook for easy consumption of the Subject Context.
 * @returns {SubjectContextType} The current subject context.
 */
export const useSubject = () => useContext(SubjectContext);
