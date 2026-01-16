// constants/Roles.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Sector } from './Schemas';

export const roles = {
    managing: {
        executiveDirector: 'ISCO-08|1120',
        humanResourcesDirector: 'ISCO-08|1212',
        itDirector: 'ISCO-08|1330',
        administrationManager: 'ISCO-08|1219',
        administrativeSecretary: 'ISCO-08|3343'
    },
    // You will later have: roles.personal, roles.healthcare, roles.emergency...
};

const uniqueRoleCodes = (codes: string[]) => Array.from(new Set(codes));

const baseAdminRoleCodes = Object.values(roles.managing);
const medicalRoleCodes = [
    'ISCO-08|2211', // Generalist Medical Practitioner
    'ISCO-08|2221', // Nursing Professional
    'ISCO-08|2240', // Paramedical Practitioner
    'ISCO-08|3221', // Nursing Associate Professional
    'ISCO-08|5329', // Hospital Orderly
    'ISCO-08|5322', // Home-Based Personal Care Worker
];
const emergencyRoleCodes = [
    'ISCO-08|5412', // Police Officer
    'ISCO-08|5411', // Firefighter
    'ISCO-08|5419', // Lifeguard / Protective services NEC
    'ISCO-08|8322', // Ambulance Driver
];
const transportRoleCodes = [
    'ISCO-08|5111', // Flight Attendant
    'ISCO-08|5112', // Train Conductor
    'ISCO-08|8331', // Bus Driver
];
const insuranceRoleCodes = [
    'ISCO-08|1346', // Insurance Manager
    'ISCO-08|3321', // Insurance Agent / Claims Adjuster
    'ISCO-08|2411', // Accountant
];
const itRoleCodes = [
    'ISCO-08|3512', // ICT Support Technician
];

export const organizationRoleCodes = uniqueRoleCodes([
    ...baseAdminRoleCodes,
    ...itRoleCodes,
    ...medicalRoleCodes,
    ...emergencyRoleCodes,
    ...transportRoleCodes,
    ...insuranceRoleCodes,
]);

export const sectorRoleCodes: Record<string, string[]> = {
    [Sector.HEALTH_CARE]: uniqueRoleCodes([...baseAdminRoleCodes, ...medicalRoleCodes, ...itRoleCodes]),
    [Sector.EMERGENCY]: uniqueRoleCodes([...baseAdminRoleCodes, ...medicalRoleCodes, ...emergencyRoleCodes, ...itRoleCodes]),
    [Sector.HEALTH_INSURANCE]: uniqueRoleCodes([...baseAdminRoleCodes, ...insuranceRoleCodes, ...itRoleCodes]),
    [Sector.RESEARCH]: uniqueRoleCodes([...baseAdminRoleCodes, ...medicalRoleCodes, ...itRoleCodes]),
};

export const professionalRoles = organizationRoleCodes;

export const getIscoRoleLabelKey = (roleCode: string | undefined | null): string => {
    if (!roleCode) return '';
    const [system, code] = roleCode.split('|');
    if (!code) return roleCode;
    return `org.isco.${system.toLowerCase()}.${code}-label`;
};
