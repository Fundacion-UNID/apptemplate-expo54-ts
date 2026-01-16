// screens/organization/OrgMgmtDepartmentsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';

export default function OrgMgmtDepartmentsScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const backgroundColor = useThemeColor({}, 'background');
  const styles = getScreenStyles(scaleFactor);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t('organization.screens.manageDepartments.title')}
          subtitle={t('organization.screens.manageDepartments.subtitle')}
        />
        <View style={{ padding: 16 }}>
          <ThemedText>{t('common.workInProgress', 'Funcionalidad en desarrollo.')}</ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}
