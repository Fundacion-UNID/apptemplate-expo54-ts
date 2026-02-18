import React from 'react';
import { Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import ScreenHeader from '../../components/ScreenHeader';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { FamilyButtons } from '../../constants/FamilyButtons';

export default function FamDataSpaceScreen({ navigation }) {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const buttons = FamilyButtons(t).dataSpace;

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.dataSpace.title', 'Data space')}
        subtitle={t('family.screens.dataSpace.subtitle', 'Organizations, services and locations')}
      />
      <AccessibleButtonGrid
        data={buttons}
        onPress={(item) => {
          if (item.route) {
            navigation.navigate(item.route);
            return;
          }
          Alert.alert(t('common.info', 'Info'), t('common.comingSoon', 'Coming soon.'));
        }}
      />
    </ScrollView>
  );
}
