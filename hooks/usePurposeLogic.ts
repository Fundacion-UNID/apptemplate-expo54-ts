// 
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { purposePresets } from '../data/purposes';

/**
 * Custom hook to manage purpose logic, filtered roles and sections,
 * and blockchain registration availability.
 */
export const usePurposeLogic = ({
  subjectSex,
  sector,
  selectedPurpose,
  rules,
  editingIndex
}) => {
  const presets = purposePresets(subjectSex);
  const preset = presets[selectedPurpose] || {};

  // Filtered lists for rendering checkboxes
  const filteredSections = preset.allowedSections || [];
  const filteredRoles = preset.allowedRoles || [];

  // Default selections when selecting purpose
  const defaultSections = preset.defaultSelectedSections || [];
  const defaultRoles = preset.allowedRoles || [];

  // Whether the blockchain button should be enabled
  const hasUnregisteredRules = rules.some((r) => !r.meta?.txId);
  const allowBlockchainRegister = hasUnregisteredRules && editingIndex < 0;

  return {
    presets,
    filteredSections,
    filteredRoles,
    defaultSections,
    defaultRoles,
    allowBlockchainRegister
  };
};
