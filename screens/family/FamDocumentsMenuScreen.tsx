import React from 'react';
import { Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import ScreenHeader from '../../components/ScreenHeader';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { FamilyButtons } from '../../constants/FamilyButtons';

export default function FamDocumentsMenuScreen({ navigation }) {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const buttons = FamilyButtons(t).documents;

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.documents.title', 'Documents')}
        subtitle={t('family.screens.documents.subtitle', 'Index, creation and traceability')}
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
