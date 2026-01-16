// screens/organization/OrgIdentityMenuScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import { OrgButtons } from '../../constants/OrgButtons';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';

export default function OrgIdentityMenuScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const screenType = 'identityMenu';
  const i18nPath = `organization.screens.${screenType}`;
  const buttons = OrgButtons(t)[screenType];

  const handlePress = (item) => {
    navigation.navigate(item.route);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
              title={t(`${i18nPath}.title`)}
      subtitle={t(`${i18nPath}.subtitle`)}
      description={t(`${i18nPath}.description`)}
      />
      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}
