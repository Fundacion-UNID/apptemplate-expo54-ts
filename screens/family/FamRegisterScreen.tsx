// screens/family/FamRegisterScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import { Routes } from '../../constants/Routes';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';

export default function FamilyRegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const backgroundColor = useThemeColor({}, 'background');
  const styles = getScreenStyles(scaleFactor);

  const buttons = [
    {
      iconName: 'vpn-key',
      iconType: 'material',
      label: t('register.joinWithCode'),
      route: Routes.Family.LoginAuth.name,
      params: { nextRoute: Routes.Family.Join.name },
    },
    {
      iconName: 'group-add',
      iconType: 'material',
      label: t('register.createNewFamily'),
      route: Routes.Family.LoginAuth.name,
      params: { nextRoute: Routes.Family.New.name },
    },
  ];

  const handlePress = (item) => {
    navigation.navigate(item.route, item.params);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('family.screens.register.title')}
        subtitle={t('family.screens.register.subtitle')}
        description={t('family.screens.register.description')}
      />

      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}
