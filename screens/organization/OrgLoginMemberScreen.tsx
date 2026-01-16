// screens/organization/OrgLoginMemberScreen.tsx

// REASON: This screen is now the SECOND step of the login flow: "Role Selection".
// It receives a verified email from the previous authentication step and allows the user
// to specify which role/organization they want to log in with. It then executes the
// final state machine to determine if the device is registered for that specific role.

import React, { FC, useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { moderateScale } from 'react-native-size-matters';

// --- Constants, Hooks, and Components ---
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';
import CountrySelector from '../../components/CountrySelector';
import ThemedText from '../../components/ThemedText';
import { useProfile } from '../../context/ProfileContext';
import { Routes } from '../../constants/Routes';
import { getIscoRoleLabelKey, organizationRoleCodes, sectorRoleCodes } from '../../constants/Roles';
import { Sector } from '../../constants/Schemas';
import { ServiceProviders } from '../../constants/Providers';

import { entityMldsaJwk, entityMlkemJwk } from 'gdc-sdk-client-ts/data/demo/entityKeys.data';
import { entityUrnCds } from 'gdc-sdk-client-ts/data/demo/didProvider.data';
import { generateDidDocument_forMock, generateWellKnownServices_forMock, generateGatewayEntityServices_forMock } from 'gdc-sdk-client-ts';
import { buildHostedDidDetails, getBaseUrlFromDidWeb, normalizeDidWeb } from 'gdc-common-utils-ts/utils/did';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { deriveProfileId } from '../../utils/profileId';
import { appWallet } from '../../platformServices';
import { hashEmail } from '../../utils/emailHash';


// --- Type Definitions ---

interface TabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  accessible?: boolean;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

type RootStackParamList = {
  OrgLoginRoleSelect: { email: string; idToken: string; };
  [key: string]: any;
};
type OrgLoginMemberScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'OrgLoginRoleSelect'>;
};

// --- Sub-components ---

const Tab: FC<TabProps> = ({ title, isActive, onPress, accessible, accessibilityRole, accessibilityLabel, accessibilityHint }) => {
    const activeColor = useThemeColor({}, 'tint');
    const inactiveColor = useThemeColor({}, 'background');
    const activeTextColor = useThemeColor({}, 'background');
    const inactiveTextColor = useThemeColor({}, 'text');
    const { scaleFactor } = useAccessibilityContext();
    const styles = getScreenStyles(scaleFactor);
  
    return (
      <Pressable
        onPress={onPress}
        style={[
          isActive ? styles.activeTab : styles.inactiveTab,
          { backgroundColor: isActive ? activeColor : inactiveColor },
        ]}
        accessible={accessible}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <ThemedText style={[{ color: isActive ? activeTextColor : inactiveTextColor, fontSize: moderateScale(12 * scaleFactor) }, styles.activeTabText]}>
          {title}
        </ThemedText>
      </Pressable>
    );
};

// --- Main Screen Component ---

export default function OrgLoginMemberScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'OrgLoginRoleSelect'>>();
    const { email: verifiedEmail, idToken } = route.params;

    const { t } = useTranslation();
    const { scaleFactor } = useAccessibilityContext();
    const tintColor = useThemeColor({}, 'tint');
    const styles = getScreenStyles(scaleFactor, tintColor);
    const backgroundColor = useThemeColor({}, 'background');
    const { sdk, initializeSession, operationMode, profileRegistry } = useProfile(); // CORRECT: Use the new unified session method
    const [isLoading, setIsLoading] = useState(false);

    const [columnCount, setColumnCount] = useState(1);
    
    useEffect(() => {
        const updateColumns = () => {
          const width = Dimensions.get('window').width;
          setColumnCount(width > 800 ? 2 : 1);
        };
        updateColumns();
        const subscription = Dimensions.addEventListener('change', updateColumns);
        return () => subscription?.remove();
    }, []);

    // Form state for role selection
    const [role, setRole] = useState<string>('');
    const [hasDomain, setHasDomain] = useState<boolean>(true);
    const [domain, setDomain] = useState<string>('');
    const [provider, setProvider] = useState<string>(ServiceProviders[0]?.url || '');
    const [jurisdiction, setJurisdiction] = useState<string>('');
    const [sector, setSector] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');

    const isFormValid = useMemo(() => {
        if (!role) return false;
        if (hasDomain) {
            return !!domain;
        } else {
            return !!provider && !!jurisdiction && !!sector && !!shortName;
        }
    }, [role, hasDomain, domain, provider, jurisdiction, sector, shortName]);

    // REASON: This is the final state machine logic for the login flow.
    const handleRoleSelectionSubmit = async () => {
        setIsLoading(true);
        // The role code is now the full string from the picker
        const roleString = role; 
        if (!roleString) {
            Alert.alert(t('common.error'), t('common.error.invalidRole'));
            setIsLoading(false);
            return;
        }

        let providerDid;
        if (hasDomain) {
            providerDid = `did:web:${domain.toLowerCase()}`;
        } else {
            const host = new URL(provider).hostname;
            const details = buildHostedDidDetails({
                host: host,
                alternateName: shortName,
                jurisdiction: jurisdiction,
                sector: sector
            });
            providerDid = details.did;
        }
        
        try {
            console.log(`[Login] Attempting to initialize session with DID: ${providerDid}`);
            
            const profileId = await deriveProfileId({
                appType: 'Organization',
                providerDid,
                email: verifiedEmail,
                role: roleString,
            });
            const newManager = await initializeSession({
                profileId,
                email: verifiedEmail,
                role: roleString,
                providerDid: providerDid,
            });

            if (newManager && newManager.profile) {
                if (profileRegistry) {
                    const emailHash = await hashEmail(verifiedEmail);
                    await profileRegistry.upsert({
                        profileId,
                        appType: 'organization',
                        providerDid,
                        role: roleString,
                        profileDisplay: shortName || providerDid,
                        emailHash,
                        lastUsedAt: new Date().toISOString(),
                    });
                }
                // The SDK has successfully created or loaded a profile.
                // Now, the UI decides where to go based on the profile's status.
                if (newManager.profile.status === 'pending') {
                    console.log("[Login] New device profile created. Navigating to Device Activation.");
                    // For the activation flow, we MUST pass the original idToken.
                    navigation.navigate(Routes.Organization.DeviceActivate.name, { idToken });
                } else { // 'active' or any other status
                    console.log("[Login] Existing device profile loaded. Navigating to Dashboard.");
                    navigation.navigate(Routes.Organization.Dashboard.name);
                }
            }
            // If newManager is null, the catch block below will handle it. No need for an else.

        } catch (error: any) {
            console.error('[Login] Failed to initialize session:', error);
            
            if (operationMode === 'DEMO') {
                console.warn('[Login] DEMO MODE: Bypassing network failure. Simulating a NEW profile and navigating to Device Activation.');
                
                const profileId = await deriveProfileId({
                    appType: 'Organization',
                    providerDid,
                    email: verifiedEmail,
                    role: roleString,
                });

                const didController = normalizeDidWeb(`${providerDid}:employee:${verifiedEmail}:${roleString}`);
                const publicKeys = await appWallet.provisionKeys(profileId);
                const mldsa = publicKeys.keys.find((key) => key.kty === 'AKP') as MldsaPublicJwk | undefined;
                const mlkem = publicKeys.keys.find((key) => key.kty === 'OKP') as MlkemPublicJwk | undefined;

                // Use the new, clean, public SDK utility to generate the exact mock DID Document we need.
                const mockDidDoc = generateDidDocument_forMock(
                    providerDid,
                    getBaseUrlFromDidWeb(providerDid),
                    [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
                    {
                        mldsa: mldsa ?? (entityMldsaJwk as MldsaPublicJwk),
                        mlkem: mlkem ?? (entityMlkemJwk as MlkemPublicJwk),
                        alsoKnownAs: entityUrnCds
                    },
                    [didController]
                );

                sdk.addMockDidDocument(providerDid, mockDidDoc);

                // This second call will be intercepted by the mock.
                initializeSession({
                    profileId,
                    email: verifiedEmail,
                    role: roleString,
                    providerDid: providerDid,
                }).then(mockManager => {
                    if (profileRegistry) {
                        hashEmail(verifiedEmail).then((emailHash) => {
                            profileRegistry.upsert({
                                profileId,
                                appType: 'organization',
                                providerDid,
                                role: roleString,
                                profileDisplay: shortName || providerDid,
                                emailHash,
                                lastUsedAt: new Date().toISOString(),
                            });
                        }).catch(() => undefined);
                    }
                    // For this demo flow of a new user, we assume the profile is always new ('pending').
                    // Therefore, we MUST navigate to the activation screen.
                    if (mockManager && mockManager.profile.status === 'pending') {
                        console.log("[Login-Mock] Mock session created with 'pending' status. Navigating to Device Activation.");
                        navigation.navigate(Routes.Organization.DeviceActivate.name, { idToken });
                    } else {
                        // This case should not be hit in this specific flow, but is a fallback.
                        console.error("[Login-Mock] ERROR: Mock session was created but status was not 'pending'. Navigating to Dashboard as a fallback.");
                        navigation.navigate(Routes.Organization.Dashboard.name);
                    }
                });

            } else {
                Alert.alert(t('common.error'), error.message || t('common.unknownError'));
            }
        } finally {
            setIsLoading(false);
        }
    };
    
        const availableRoleCodes = useMemo(() => {
            if (hasDomain) return organizationRoleCodes;
            if (!sector) return organizationRoleCodes;
            return sectorRoleCodes[sector] || organizationRoleCodes;
        }, [hasDomain, sector]);

        useEffect(() => {
            if (role && !availableRoleCodes.includes(role)) {
                setRole('');
            }
        }, [role, availableRoleCodes]);

	    const roleItems = availableRoleCodes.map((roleValue) => ({
	        value: roleValue,
	        label: t(getIscoRoleLabelKey(roleValue), roleValue),
	    }));

    const sectorItems = Object.values(Sector).map(sector => ({
        label: t(`pickers.sectors.${sector.replace('_', '-').toLowerCase()}`),
        value: sector,
    }));
    
    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <ThemedText>{t('common.loading')}</ThemedText>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
            <ScreenHeader
                title={t('organization.screens.login.title')}
                subtitle={t('organization.screens.login.subtitle')}
                description={undefined}
            />            
            <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {/* Email field is now pre-filled and disabled */}
                    <View style={{ width: '100%', padding: 8 }}>
                        <ThemedText style={styles.formLabel}>{t('organization.screens.login.email-label')}</ThemedText>
                        <ThemedInput
                            value={verifiedEmail}
                            editable={false}
                            style={{ opacity: 0.7 }}
                        />
                    </View>
                    <View style={{ width: '100%', padding: 8 }}>
                        <ThemedText style={styles.formLabel}>{t('organization.screens.login.role-label')}</ThemedText>
                        <ThemedPicker
                            selectedValue={role}
                            onValueChange={setRole}
                            items={[{ label: t('organization.screens.newRepresentative.options.role-picker-placeholder'), value: '' }, ...roleItems]}
                        />
                    </View>
                </View>

                <ThemedText style={styles.formHeader}>
                    {t('organization.screens.login.connectorData-header')}
                </ThemedText>
                <View style={styles.tabGroupContainer}>
                    <View style={styles.tabGroup}>
                        <Tab
                            title={t('organization.screens.login.hasDomain-label')}
                            isActive={hasDomain}
                            onPress={() => setHasDomain(true)}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={t('organization.screens.login.hasDomain-label')}
                        />
                        <Tab
                            title={t('organization.screens.login.isHosted-label')}
                            isActive={!hasDomain}
                            onPress={() => setHasDomain(false)}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={t('organization.screens.login.isHosted-label')}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {hasDomain ? (
                        <View style={{ width: '100%', padding: 8 }}>
                            <ThemedText style={styles.formLabel}>{t('organization.screens.login.domain-label')}</ThemedText>
                            <ThemedInput
                                placeholder={t('organization.screens.login.domain-placeholder')}
                                value={domain}
                                onChangeText={setDomain}
                                style={{}}
                            />
                        </View>
                    ) : (
                        <>
                            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                                <ThemedText style={styles.formLabel}>{t('organization.screens.login.provider-label')}</ThemedText>
                                <ThemedPicker
                                    selectedValue={provider}
                                    onValueChange={setProvider}
                                    items={ServiceProviders.map(p => ({ label: p.name, value: p.url }))}
                                />
                            </View>
                            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                                <ThemedText style={styles.formLabel}>{t('organization.screens.login.shortName-label')}</ThemedText>
                                <ThemedInput
                                    placeholder={t('organization.screens.login.shortName-placeholder')}
                                    value={shortName}
                                    onChangeText={setShortName}
                                    style={{}}
                                />
                            </View>
                            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                                <ThemedText style={styles.formLabel}>{t('organization.screens.login.jurisdiction-label')}</ThemedText>
                                <CountrySelector
                                    value={jurisdiction}
                                    onChange={setJurisdiction}
                                    placeholder={t('common.forms.jurisdictionPlaceholder')}
                                />
                            </View>
                            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                                <ThemedText style={styles.formLabel}>{t('common.sector')}</ThemedText>
                                <ThemedPicker
                                    selectedValue={sector}
                                    onValueChange={setSector}
                                    items={[{ label: t('organization.screens.newEntity.options.sector-placeholder'), value: '' }, ...sectorItems]}
                                />
                            </View>
                        </>
                    )}
                </View>
                
                <ThemedButton
                    title={t('continue')}
                    onPress={handleRoleSelectionSubmit}
                    disabled={!isFormValid}
                    style={{ marginTop: 32 }}
                />
            </View>
        </ScrollView>
    );
}
