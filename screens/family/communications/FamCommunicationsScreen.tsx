// screens/family/communications/FamCommunicationsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../../../context/AccessibilityContext';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/style_family';
import { FamilyButtons } from '../../../constants/FamilyButtons';
import ScreenHeader from '../../../components/ScreenHeader';
import AccessibleButtonGrid from '../../../components/AccessibleButtonGrid';

export default function FamilyCommunicationsScreen({ navigation }) {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  const screenType = 'communications';
  const i18nPath = `family.screens.${screenType}`;
  const buttons = FamilyButtons(t)[screenType];

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
              title={t(`${i18nPath}.title`)}
      subtitle={t(`${i18nPath}.subtitle`)}
      description={t(`${i18nPath}.description`)}
      />
      <AccessibleButtonGrid data={buttons} onPress={(item) => navigation.navigate(item.route)} />
    </ScrollView>
  );
}
