// screens/family/FamRegistrySentScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../hooks/useThemeColor';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import { Routes } from '../../constants/Routes';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { createVaultForProfile } from '../../platformServices';
import { JobRequest, JobStatus } from 'gdc-common-utils-ts/models/confidential-job';
import { getRegistryRefreshIntervalMs } from '../../utils/runtimeConfig';
import { useEntitlements } from '../../context/EntitlementContext';
import { parseOfferEntitlementFromClaims } from 'gdc-sdk-client-ts';

type Props = {
  route: { params?: { thid?: string } };
  navigation: any;
};

type StoredMessage = {
  id: string;
  thid?: string;
  statusCode?: number;
  content?: any;
};

function findActivationCode(claims: Record<string, any> | undefined): string | undefined {
  if (!claims) return undefined;
  const schema = claims['org.schema.IndividualProduct.serialNumber'];
  return typeof schema === 'string' ? schema : undefined;
}

export default function FamRegistrySentScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { thid } = route.params || {};
  const backgroundColor = useThemeColor({}, 'background');

  const { profileManager } = useProfile();
  const { accessToken: idToken } = useSubject();
  const { setAvailable } = useEntitlements();

  const [job, setJob] = useState<JobRequest | null>(null);
  const [offerId, setOfferId] = useState<string | undefined>(undefined);
  const [activationCode, setActivationCode] = useState<string | undefined>(undefined);
  const [offerQuantity, setOfferQuantity] = useState<string | undefined>(undefined);
  const [offerUnitPrice, setOfferUnitPrice] = useState<string | undefined>(undefined);
  const [offerTotalPrice, setOfferTotalPrice] = useState<string | undefined>(undefined);
  const [offerTaxes, setOfferTaxes] = useState<string | undefined>(undefined);
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const canContinue = useMemo(() => {
    return !!profileManager && !!thid;
  }, [profileManager, thid]);

  const refresh = useCallback(async () => {
    if (!profileManager || !thid) return;

    try {
      const jobs = await profileManager.queryJobs({
        where: [{ attribute: 'thid', equals: thid }],
        limit: 1,
      });

      const found = jobs?.[0] ?? null;
      setJob(found);
      if (!found || found.status !== JobStatus.COMPLETED) return;

      const responseMessageId = (found as any).responseMessageId as string | undefined;
      if (!responseMessageId) return;

      const vault = createVaultForProfile(profileManager.profile.id);
      await vault.initialize();
      const message = (await vault.get<StoredMessage>('messages', responseMessageId)) || undefined;
      const responseContent = message?.content;

      const responseClaims =
        responseContent?.body?.data?.[0]?.meta?.claims ||
        responseContent?.body?.entry?.[0]?.meta?.claims;

      const offer = parseOfferEntitlementFromClaims(responseClaims);
      const extractedOfferId = offer.offerId;
      const extractedActivationCode = findActivationCode(responseClaims);
      const extractedOfferQuantity = typeof offer.quantity === 'number' ? String(offer.quantity) : undefined;
      const extractedOfferUnitPrice = offer.unitPrice;
      const extractedOfferTotalPrice = offer.totalPrice;
      const extractedOfferTaxes = offer.taxes;
      const extractedCheckoutUrl = offer.checkoutUrl;

      if (extractedOfferId) setOfferId(extractedOfferId);
      if (extractedActivationCode) setActivationCode(extractedActivationCode);
      if (extractedOfferQuantity) setOfferQuantity(extractedOfferQuantity);
      if (extractedOfferUnitPrice) setOfferUnitPrice(extractedOfferUnitPrice);
      if (extractedOfferTotalPrice) setOfferTotalPrice(extractedOfferTotalPrice);
      if (extractedOfferTaxes) setOfferTaxes(extractedOfferTaxes);
      if (extractedCheckoutUrl) setCheckoutUrl(extractedCheckoutUrl);
      if (extractedOfferQuantity) {
        setAvailable('member', Number(extractedOfferQuantity));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, [profileManager, thid, setAvailable]);

  useEffect(() => {
    if (!canContinue) return;
    refresh();
    const handle = setInterval(refresh, getRegistryRefreshIntervalMs());
    return () => clearInterval(handle);
  }, [canContinue, refresh]);

  const handleConfirmOrder = useCallback(async () => {
    if (!profileManager) return;
    if (!idToken) {
      setError('Authorization token is missing.');
      return;
    }
    if (!offerId) {
      setError('Offer identifier is missing.');
      return;
    }

    const familyAdmin = profileManager.familyAdmin?.admin;
    if (!familyAdmin) {
      setError('Family admin services are not available for this session.');
      return;
    }

    setIsBusy(true);
    setError(null);
    try {
      const gatewayDid = profileManager.orgDidDoc.id;
      const { thid: orderThid } = await familyAdmin.confirmFamilyOrder(offerId, gatewayDid, idToken);
      navigation.replace(Routes.Family.RegistrySent.name, { thid: orderThid });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsBusy(false);
    }
  }, [profileManager, idToken, offerId, navigation]);

  const statusLabel = useMemo(() => {
    if (!job) return '—';
    return job.status;
  }, [job]);

  return (
    <View style={{ flex: 1, backgroundColor, justifyContent: 'center', padding: 20 }}>
      <ScreenHeader
        title={t('family.screens.registrySent.title', 'Family onboarding')}
        subtitle={t('family.screens.registrySent.subtitle', 'Submitting and waiting for async processing')}
        description={t(
          'family.screens.registrySent.description',
          'This flow is asynchronous: the app submits a job and polls until the gateway returns the final result.'
        )}
      />

      <ThemedText selectable style={{ fontFamily: 'monospace', marginVertical: 8, textAlign: 'center' }}>
        {thid || ''}
      </ThemedText>

      {!canContinue && (
        <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginBottom: 16 }}>
          {t('common.error', 'Error')}: missing session or thid.
        </ThemedText>
      )}

      {error && (
        <ThemedText style={{ textAlign: 'center', opacity: 0.9, marginBottom: 16 }}>
          {error}
        </ThemedText>
      )}

      <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginBottom: 8 }}>
        {t('family.screens.registrySent.status', 'Status')}: {statusLabel}
      </ThemedText>

      {!job || job.status !== JobStatus.COMPLETED ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {offerId && (
            <>
              <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginTop: 16 }}>
                {t('family.screens.registrySent.offerId', 'Offer')}:
              </ThemedText>
              <ThemedText selectable style={{ fontFamily: 'monospace', marginVertical: 8, textAlign: 'center' }}>
                {offerId}
              </ThemedText>
              {offerQuantity ? (
                <ThemedText style={{ textAlign: 'center', opacity: 0.8 }}>
                  Qty: {offerQuantity}
                </ThemedText>
              ) : null}
              {offerUnitPrice ? (
                <ThemedText style={{ textAlign: 'center', opacity: 0.8 }}>
                  Unit: {offerUnitPrice}
                </ThemedText>
              ) : null}
              {offerTaxes ? (
                <ThemedText style={{ textAlign: 'center', opacity: 0.8 }}>
                  Taxes: {offerTaxes}
                </ThemedText>
              ) : null}
              {offerTotalPrice ? (
                <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginBottom: 8 }}>
                  Total: {offerTotalPrice}
                </ThemedText>
              ) : null}
              <ThemedButton
                title={t('family.screens.registrySent.confirmOrder', 'Confirm order')}
                onPress={handleConfirmOrder}
                disabled={isBusy}
              />
            </>
          )}

          {activationCode && (
            <>
              <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginTop: 16 }}>
                {t('family.screens.registrySent.activationCode', 'Activation code')}:
              </ThemedText>
              <ThemedText selectable style={{ fontFamily: 'monospace', marginVertical: 8, textAlign: 'center' }}>
                {activationCode}
              </ThemedText>
              <ThemedButton
                title={t('common.continue', 'Continue')}
                onPress={() => navigation.navigate(Routes.Family.LoginAuth.name)}
                disabled={isBusy}
              />
            </>
          )}

          {!activationCode && checkoutUrl && (
            <ThemedButton
              title={t('common.continue', 'Continue')}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open(checkoutUrl, '_blank');
                } else {
                  Linking.openURL(checkoutUrl);
                }
              }}
              disabled={isBusy}
            />
          )}

          {!offerId && !activationCode && (
            <ThemedButton
              title={t('common.continue', 'Continue')}
              onPress={() => navigation.navigate(Routes.Family.LoginAuth.name)}
              disabled={isBusy}
            />
          )}
        </>
      )}
    </View>
  );
}
