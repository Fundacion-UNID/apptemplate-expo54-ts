// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: context/ProfileContext.tsx

/**
 * @file This file defines the React Context bridge to the active ProfileManager session.
 * Its primary role is to hold the current `ProfileManager` instance from the ClientSDK
 * in React state and provide it to the rest of the application.
 * @app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ClientSDK, InitializeSessionParams } from 'gdc-sdk-client-ts';
import { CryptographyService } from 'gdc-common-utils-ts/CryptographyService';
import { VerifierService } from 'gdc-sdk-client-ts/VerifierService';
import { ProfileManager } from 'gdc-sdk-client-ts/ProfileManager';
import { IProfile } from 'gdc-sdk-client-ts/interfaces/IProfile';
import { AdapterCryptoSdkExpo, AdapterNetworkSdkExpo, AdapterApiConfigSdkExpo } from '../adapters-sdk-expo';
import Constants from 'expo-constants';
import { appWallet, createVaultForProfile } from '../platformServices';
import { AppInfo, DeviceInfo, SdkConfig, MockOptions } from 'gdc-sdk-client-ts/interfaces/others';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
// Import mock data ONLY for DEMO mode
import { MOCK_ICA_DID_DOCUMENT, MOCK_ROOT_GOVERNING_KEY_PUB } from '../data/demo/sdkMockData';

// --- Context Type Definition ---
interface ProfileContextValue {
    sdk: ClientSDK; // Expose the full SDK instance
    operationMode: string; // Expose the operation mode for UI decisions
    profileManager: ProfileManager | null;
    profile: IProfile | null;
    setProfile: (profile: IProfile) => void;
    isLoading: boolean;
    initializeSession: (params: InitializeSessionParams) => Promise<ProfileManager | null>;
    shutdownSession: () => void;
    profileRegistry: import('gdc-sdk-client-ts').ProfileRegistry | null;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

// --- Provider Props Definition ---
interface ProfileProviderProps {
    children: ReactNode;
}

const isLoopbackHost = (host: string): boolean => {
    const normalized = host.toLowerCase();
    return (
        normalized === 'localhost' ||
        normalized.startsWith('localhost:') ||
        normalized === '127.0.0.1' ||
        normalized.startsWith('127.0.0.1:')
    );
};

/**
 * SDK compatibility shim:
 * Some SDK DID resolvers currently build URLs like:
 *   https://localhost%3A3000/.well-known/did.json
 * which are invalid for fetch().
 * We decode host "%3A" -> ":" and use http:// for loopback hosts.
 */
const normalizeSdkFetchUrl = (rawUrl: string): string => {
    if (!rawUrl) return rawUrl;
    const match = rawUrl.match(/^https:\/\/([^/]+)(\/.*)?$/i);
    if (!match) return rawUrl;

    const encodedHost = match[1] || '';
    if (!/%3A/i.test(encodedHost)) return rawUrl;

    const decodedHost = encodedHost.replace(/%3A/gi, ':');
    const suffix = match[2] || '';
    const protocol = isLoopbackHost(decodedHost) ? 'http' : 'https';
    return `${protocol}://${decodedHost}${suffix}`;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const [profileManager, setProfileManager] = useState<ProfileManager | null>(null);
    const [profileOverride, setProfileOverride] = useState<IProfile | null>(null);
    const [profileRegistry, setProfileRegistry] = useState<import('gdc-sdk-client-ts').ProfileRegistry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // useMemo ensures the SDK and its config are instantiated only once.
    const sdk = useMemo(() => {
        // 1. Normalize the operation mode.
        const operationMode = (Constants.expoConfig?.extra?.OPERATION_MODE || 'DEMO').toUpperCase();

        const cryptoAdapter = new AdapterCryptoSdkExpo();
        let mockOptions: MockOptions | undefined = undefined;
        let rootGoverningKeyPub: string;
        let icaDid: string;

        // 2. Configure based on the normalized operation mode.
        if (operationMode === 'DEMO') {
            console.warn("[ProfileContext] OPERATION_MODE is DEMO. Using mock trust anchors.");
            rootGoverningKeyPub = MOCK_ROOT_GOVERNING_KEY_PUB;
            icaDid = MOCK_ICA_DID_DOCUMENT.id;
            mockOptions = {
                trustAnchors: {
                    rootGoverningKeyPub: rootGoverningKeyPub,
                    icaDidDoc: MOCK_ICA_DID_DOCUMENT,
                },
                resolvedDidDocs: {
                    // Only static, universal DIDs should be pre-resolved here. Dynamic DIDs
                    // created in the UI will be handled by the screen's DEMO logic.
                    [MOCK_ICA_DID_DOCUMENT.id]: MOCK_ICA_DID_DOCUMENT,
                }
            };
        } else if (operationMode === 'STAGING' || operationMode === 'PRODUCTION') {
            console.log(`[ProfileContext] OPERATION_MODE is ${operationMode}. Using environment variables for trust anchors.`);
            rootGoverningKeyPub = process.env.EXPO_PUBLIC_ROOT_GOVERNING_KEY_PUB!;
            icaDid = process.env.EXPO_PUBLIC_ICA_DID!;

            if (!rootGoverningKeyPub || !icaDid) {
                throw new Error(`CRITICAL (${operationMode}): EXPO_PUBLIC_ROOT_GOVERNING_KEY_PUB and EXPO_PUBLIC_ICA_DID environment variables must be set.`);
            }
        } else {
            throw new Error(`[ProfileContext] Invalid OPERATION_MODE: "${operationMode}". Must be DEMO, STAGING, or PRODUCTION.`);
        }

        const sdkConfig: SdkConfig = {
            crypto: cryptoAdapter,
            network: new AdapterNetworkSdkExpo(),
            api: new AdapterApiConfigSdkExpo(),
            fetcher: async (input: RequestInfo | URL, init?: RequestInit) => {
                const originalUrl =
                    typeof input === 'string'
                        ? input
                        : input instanceof URL
                            ? input.href
                            : input.url;
                const normalizedUrl = normalizeSdkFetchUrl(originalUrl);
                const normalizedInput: RequestInfo | URL =
                    typeof input === 'string' ? normalizedUrl : normalizedUrl !== originalUrl ? new URL(normalizedUrl) : input;
                try {
                    const response = await globalThis.fetch(normalizedInput, init);
                    if (response.status === 404) {
                        console.warn(`Not found: ${normalizedUrl}`);
                    }
                    return response;
                } catch (error) {
                    console.warn(`Not found: ${normalizedUrl}`);
                    throw error;
                }
            },
            mockOptions: mockOptions,
        };

        const deviceInfo: DeviceInfo = {
            device_id: Device.osInternalBuildId || 'unknown',
            device_name: Device.deviceName || 'unknown',
            os: Platform.OS,
            os_version: Device.osVersion || 'unknown',
        };

        const appInfo: AppInfo = {
            appType: 'Organization',
            sector: 'health-care',
            applicationType: Platform.OS === 'web' ? 'web' : 'native',
            redirectUris: ['myapp://callback'],
            deviceInfo: deviceInfo,
        };
        
        const cryptoService = new CryptographyService(cryptoAdapter);
        const verifierService = new VerifierService(cryptoService, rootGoverningKeyPub, sdkConfig.fetcher);

        return new ClientSDK(sdkConfig, appInfo, appWallet, verifierService, icaDid);
    }, []);

    const initializeSession = async (params: InitializeSessionParams): Promise<ProfileManager | null> => {
        console.log('[DEBUG] ProfileContext: initializeSession capability triggered via SDK.');
        try {
            setIsLoading(true);
            const newManager = await sdk.initializeSession(params, createVaultForProfile);
            setProfileManager(newManager);
            setProfileOverride(null);
            console.log('[DEBUG] ProfileContext: New session created and set.');
            return newManager;
        } catch (error) {
            console.error("Failed to create session:", error);
            setProfileManager(null);
            // Re-throw the original error so the calling screen can handle it.
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const shutdownSession = () => {
        console.log('[DEBUG] ProfileContext: shutdownSession capability triggered via SDK.');
        sdk.shutdownSession();
        setProfileManager(null);
        setProfileOverride(null);
    };

    const setProfile = (nextProfile: IProfile) => {
        if (profileManager) {
            profileManager.profile = nextProfile;
        }
        setProfileOverride(nextProfile);
    };
    
    // On initial mount, we can decide if we want to auto-create a session
    // or wait for a user action. For now, we'll just finish loading.
    useEffect(() => {
        // If there's a need to restore a session, that logic would go here.
        // For now, we simply transition from the loading state.
        setIsLoading(false);
        sdk
            .initializeProfileRegistry(createVaultForProfile)
            .then((registry) => setProfileRegistry(registry))
            .catch((error) => console.warn('[ProfileContext] Failed to initialize profile registry:', error));

        // Cleanup session on unmount
        return () => {
            sdk.shutdownSession();
        };
    }, [sdk]);

    const value = {
        sdk: sdk,
        operationMode: sdk.operationMode, // Use the new public getter
        profileManager,
        profile: (profileOverride ?? profileManager?.profile) || null,
        setProfile,
        isLoading,
        initializeSession,
        shutdownSession,
        profileRegistry,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = (): ProfileContextValue => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
