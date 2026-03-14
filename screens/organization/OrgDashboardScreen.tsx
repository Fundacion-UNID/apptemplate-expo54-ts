// screens/organization/OrgDashboardScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { useTranslation } from 'react-i18next';

import AccessibleButtonGrid, { ButtonItem } from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import ConfirmationModal from '../../components/ConfirmationModal';
import { OrgButtons } from '../../constants/OrgButtons';
import { getScreenStyles } from '../../constants/Styles';
import { Routes } from '../../constants/Routes';
import ThemedText from '../../components/ThemedText';
import { useEntitlements } from '../../context/EntitlementContext';
import { useOrgRegistryForm } from '../../context/OrgRegistryFormContext';
import { appWallet } from '../../platformServices';
import { entityMldsaJwk } from '../../data/demo/sdkMockData';

// Define a basic type for the navigation prop for this screen.
type OrgDashboardScreenNavigationProp = {
  navigate: (routeName: string) => void;
  addListener: (event: 'beforeRemove', callback: (e: any) => void) => () => void;
  removeListener: (event: 'beforeRemove', callback: (e: any) => void) => void;
};

type OrgDashboardScreenProps = {
  navigation: OrgDashboardScreenNavigationProp;
};

const OrgDashboardScreen: React.FC<OrgDashboardScreenProps> = ({ navigation }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const { shutdownSession, profile } = useProfile();
  const { icaVerification } = useOrgRegistryForm();
  const { employeeAvailable } = useEntitlements();
  const styles = getScreenStyles(scaleFactor);
  const didDocumentAutorunDoneRef = useRef(false);

  const screenType = 'dashboard';
  const i18nPath = `organization.screens.${screenType}`;
  const { t } = useTranslation();
  const buttons: ButtonItem[] = OrgButtons(t)[screenType];

  const [isModalVisible, setModalVisible] = useState(false);
  const shouldAttachDidDocumentOnDashboard = process.env.EXPO_PUBLIC_ORG_ICA_ATTACH_DID_ON_DASHBOARD === 'true';

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Show our custom modal
        setModalVisible(true);
      };

      navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [navigation])
  );

  const handleConfirmExit = () => {
    setModalVisible(false);
    shutdownSession(); // Use the shutdown function from the context
    navigation.navigate(Routes.Landing.name);
  };

  const handleCancelExit = () => {
    setModalVisible(false);
  };

  const handlePress = (item: ButtonItem) => {
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  useEffect(() => {
    if (!shouldAttachDidDocumentOnDashboard || didDocumentAutorunDoneRef.current) {
      return;
    }

    const organizationCredential = icaVerification?.organizationCredential;
    const legalRepresentativeCredential = icaVerification?.legalRepresentativeCredential;
    const existingOrganizationDidDocument = icaVerification?.organizationDidDocument;
    const profileId = profile?.id;
    if (existingOrganizationDidDocument || !organizationCredential || !legalRepresentativeCredential || !profileId) {
      return;
    }

    didDocumentAutorunDoneRef.current = true;

    const runDidDocumentAttach = async () => {
      try {
        // TODO(gwtemplate-node-ts): replace this dashboard-side smoke test with the
        // real connector activation flow. The connector should generate and keep its
        // own organization keypair, and the controller should send a self-signed
        // VP token carrying the ICA-issued organization + representative credentials
        // to the gwtemplate create-organization endpoint. Device/DCR keys come later.
        const sdkModule: any = await import('ica-client-sdk-ts');
        const { IcaClient, Sector } = sdkModule;

        const keySet = await appWallet.provisionKeys(profileId);
        const signingKey =
          keySet.keys.find((key: any) => key.kty === 'AKP') ||
          keySet.keys[0] ||
          entityMldsaJwk;

        const baseUrl = process.env.EXPO_PUBLIC_ICA_BASE_URL || 'http://localhost:3310';
        const client = new IcaClient({
          sector: Sector.HealthCare,
          didWeb: process.env.EXPO_PUBLIC_ICA_README_DEMO_DID_WEB || 'did:web:ica',
          organizationVcs: [],
          baseUrl,
          retryTimes: 5,
          retryDelayMs: 1500,
          fetch: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
        });

        console.log('[ICA DID document] create input', {
          organizationDid: organizationCredential?.credentialSubject?.id,
          controllerSameAs: legalRepresentativeCredential?.credentialSubject?.sameAs,
          profileId,
          usesSharedSigningKeyTemporarily: true,
        });

        const { thid, location } = await client.createOrgDidDocumentFromVcs({
          organizationVC: organizationCredential,
          legalRepresentativeVC: legalRepresentativeCredential,
          organizationPublicKeyJwk: signingKey,
          controllerPublicKeyJwk: signingKey,
        });

        console.log('[ICA DID document] accepted', { thid, location });

        const didDocumentResponse = await client.pollCreateOrgDidDocumentResponse(thid);
        const didDocument =
          didDocumentResponse?.body?.data?.[0]?.resource?.didDocument ||
          didDocumentResponse?.body?.data?.[0]?.resource;

        console.log('[ICA DID document] response', didDocumentResponse);
        console.log('[ICA DID document] didDocument', didDocument);
      } catch (error) {
        console.error('[ICA DID document] failed', error);
      }
    };

    runDidDocumentAttach();
  }, [
    icaVerification,
    profile?.id,
    shouldAttachDidDocumentOnDashboard,
  ]);

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t(`${i18nPath}.title`)}
          subtitle={t(`${i18nPath}.subtitle`)}
          description={t(`${i18nPath}.description`)}
        />
        <ThemedText style={{ marginBottom: 10, opacity: 0.8 }}>
          {t('organization.screens.dashboard.employeeLicenses', 'Available employee licenses')}: {employeeAvailable}
        </ThemedText>
        <AccessibleButtonGrid data={buttons} onPress={handlePress} />
      </ScrollView>
      <ConfirmationModal
        visible={isModalVisible}
        title={t('organization.screens.dashboard.exitConfirm.title')}
        message={t('organization.screens.dashboard.exitConfirm.message')}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        confirmText={t('common.exit')}
        cancelText={t('common.cancel')}
      />
    </>
  );
};

export default OrgDashboardScreen;
