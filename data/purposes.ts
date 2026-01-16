// utils/purposes.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

// TODO: translate
export const purposePresets = (sexParam = '') => ({
  ECONTACT: {
    label: 'Emergency Contact Access',
    allowedRoles: [
      "isco-08.5412", // Police officer
      "isco-08.5411", // Firefighter
      "isco-08.5419", // Lifeguard
    ],
    allowedSections: ["healthcare.56796-6"],
    defaultSelectedSections: ["healthcare.56796-6"]
  },
  ETREAT: {
    label: 'Emergency Medical Treatment',
    allowedRoles: [
      "isco-08.2211", // General medical practitioners
      "isco-08.2221", // Nurses
      "isco-08.3258", // Paramedics
    ],
    allowedSections: [
      "healthcare.56796-6", "healthcare.48765-2", "healthcare.11450-4",
      "healthcare.10160-0", "healthcare.82810-3"
    ],
    defaultSelectedSections: [
      "healthcare.56796-6",
      "healthcare.48765-2",
      "healthcare.11450-4",
      "healthcare.10160-0",
      ...(sexParam === 'F' ? ["healthcare.82810-3"] : [])
    ]
  },
  TREAT: {
    label: 'Planned Treatment',
    allowedRoles: [
      "isco-08.2211",
      "isco-08.2221",
    ],
    allowedSections: [
      "healthcare.11450-4", "healthcare.10160-0", "healthcare.11369-6",
      "healthcare.30954-2", "healthcare.82810-3"
    ],
    defaultSelectedSections: [
      "healthcare.11450-4",
      "healthcare.10160-0",
      "healthcare.11369-6",
      ...(sexParam === 'F' ? ["healthcare.82810-3"] : [])
    ]
  }
});
