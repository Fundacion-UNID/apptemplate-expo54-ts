// 
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { getScreenStyles } from '../constants/Styles';
import ThemedText from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import { Routes } from '../constants/Routes';

export default function MyFamilyScreen() {
  const { accessibility } = useAccessibilityContext();
  const styles = getScreenStyles(); // No necesitas scaleFactor manual si no es para algo especial.

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const subjectType = route.params?.subjectType || 'family';

  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor, alignItems: 'center' }]}>
      <ThemedText accessible accessibilityRole="header" style={styles.title}>
        {t('myfamily.title')}
      </ThemedText>

      <ThemedText accessible accessibilityRole="text" style={styles.subtitle}>
        {t('myfamily.subtitle')}
      </ThemedText>

      <ThemedButton
        title={t('myfamily.members')}
        onPress={() => navigation.navigate(Routes.Family.New.name, { subjectType })}
        style={styles.button}
      />

      <ThemedButton
        title={t('myfamily.consents')}
        onPress={() => navigation.navigate(Routes.Family.Permissions.name, { subjectType })}
        style={styles.button}
      />
    </View>
  );
}
