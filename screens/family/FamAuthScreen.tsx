// screens/family/FamAuthScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
 
import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import { FamilyButtons } from '../../constants/FamilyButtons';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';

export default function FamilyAuthScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const backgroundColor = useThemeColor({}, 'background');
  const styles = getScreenStyles(scaleFactor);

  const buttons = FamilyButtons(t).auth;

  const handlePress = (item) => {
    navigation.navigate(item.route);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('family.screens.auth.title')}
        subtitle={t('family.screens.auth.subtitle')}
        description={t('family.screens.auth.description')}
      />

      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}
