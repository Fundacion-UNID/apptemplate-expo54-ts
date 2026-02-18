// screens/family/FamDashboardScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';
import { FamilyButtons } from '../../constants/FamilyButtons';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { buildScopesFromEndpoints } from 'gdc-sdk-client-ts';

export default function FamilyDashboardScreen({ navigation }) {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { profileManager, operationMode } = useProfile();
  const { accessToken: idToken } = useSubject();

  const buttons = FamilyButtons(t).dashboard;
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

  const requiredScopes = useMemo(
    () => buildScopesFromEndpoints([
      {
        prefix: 'user',
        resourceType: 'Composition',
        action: 'write',
      },
    ]),
    []
  );

  const requestToken = useCallback(async () => {
    if (!profileManager || !idToken) return;
    if (!profileManager.familyAdmin && !profileManager.individual) return;
    setIsAuthorizing(true);
    setAuthError(null);
    try {
      await profileManager.getSmartToken(profileManager.orgDidDoc.id, requiredScopes, idToken);
      setTokenReady(true);
    } catch (e) {
      if (operationMode === 'DEMO') {
        setTokenReady(true);
      } else {
        setAuthError((e as Error).message);
        setTokenReady(false);
      }
    } finally {
      setIsAuthorizing(false);
    }
  }, [profileManager, idToken, requiredScopes, operationMode]);

  useEffect(() => {
    requestToken();
  }, [requestToken]);

  if (!tokenReady) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t('family.screens.dashboard.title')}
          subtitle={t('family.screens.dashboard.subtitle')}
          description={t('family.screens.dashboard.authGate', 'Fetching SMART access token for this session.')}
        />
        {isAuthorizing ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {authError && (
              <ThemedText style={{ marginTop: 12, opacity: 0.9 }}>
                {authError}
              </ThemedText>
            )}
            <ThemedButton
              title={t('common.retry', 'Retry')}
              onPress={requestToken}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('family.screens.dashboard.title')}
        subtitle={t('family.screens.dashboard.subtitle')}
      />

      <AccessibleButtonGrid data={buttons} onPress={(item) => navigation.navigate(item.route)} />
    </ScrollView>
  );
}
