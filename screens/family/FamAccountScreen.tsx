import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import { CommonActions } from '@react-navigation/native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { Routes } from '../../constants/Routes';

export default function FamAccountScreen({ navigation }) {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { profile, shutdownSession } = useProfile();
  const { accessToken, setSubject, setSubjectContext } = useSubject();
  const compactLabelStyle = {
    fontSize: moderateScale(12 * Math.max(1, scaleFactor * 0.9)),
    opacity: 0.8 as const,
    marginTop: 10,
  };
  const compactValueStyle = {
    fontSize: moderateScale(13 * Math.max(1, scaleFactor * 0.9)),
    lineHeight: moderateScale(18 * Math.max(1, scaleFactor * 0.9)),
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.account.title', 'My account')}
        subtitle={t('family.screens.account.subtitle', 'Profile, DID and session')}
      />
      <View style={{ width: '100%', padding: 16 }}>
        <ThemedText style={compactLabelStyle}>{t('family.screens.account.email', 'Email')}</ThemedText>
        <ThemedText style={compactValueStyle}>{profile?.email || '—'}</ThemedText>

        <ThemedText style={compactLabelStyle}>{t('family.screens.account.role', 'Role')}</ThemedText>
        <ThemedText style={compactValueStyle}>{profile?.role || '—'}</ThemedText>

        <ThemedText style={compactLabelStyle}>{t('family.screens.account.did', 'My DID')}</ThemedText>
        <ThemedText selectable style={compactValueStyle}>{profile?.did || '—'}</ThemedText>

        <ThemedText style={compactLabelStyle}>{t('family.screens.account.providerDid', 'Provider DID')}</ThemedText>
        <ThemedText selectable style={compactValueStyle}>{profile?.providerDid || '—'}</ThemedText>

        <ThemedText style={compactLabelStyle}>{t('family.screens.account.token', 'Token available')}</ThemedText>
        <ThemedText style={compactValueStyle}>{accessToken ? 'yes' : 'no'}</ThemedText>

        <ThemedButton
          title={t('family.screens.account.tasksHistory', 'Tasks history')}
          onPress={() => navigation.navigate('Jobs')}
          style={{ marginTop: 16 }}
        />
        <ThemedButton
          title={t('family.screens.account.logout', 'Sign out')}
          onPress={() => {
            shutdownSession();
            setSubject(null, null);
            setSubjectContext({ familyId: null, subjectDid: null, subjectVaultId: null });
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Routes.Landing.name }],
              })
            );
          }}
          style={{ marginTop: 12 }}
        />
      </View>
    </ScrollView>
  );
}
