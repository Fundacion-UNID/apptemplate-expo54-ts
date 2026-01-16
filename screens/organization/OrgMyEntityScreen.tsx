// screens/organization/OrgMyEntityScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ScrollView } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import { OrgButtons } from '../../constants/OrgButtons';
import { getScreenStyles } from '../../constants/Styles';

export default function OrgMyEntityScreen({ navigation }) {
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  const screenType = 'myEntity';
  const i18nPath = `organization.screens.${screenType}`; // Using 'myEntity' for translations as discussed
  const { t } = useTranslation();
  const buttons = OrgButtons(t)[screenType];

  const handlePress = (item) => navigation.navigate(item.route);

  return (
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
      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}
