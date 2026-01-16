// screens/organization/OrgManageUnifiedHealthIdScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { Routes } from '../../constants/Routes';

export default function OrgManageUnifiedIndexScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const buttons = [
    {
      iconName: 'fingerprint',
      label: t('unifiedID.registerButton'),
      route: Routes.Organization.RegisterUnifiedIndex.name,
    },
    {
      iconName: 'add-to-photos',
      label: t('unifiedID.addEvidenceButton'),
      // route: '...', 
    },
    {
      iconName: 'rule',
      label: t('unifiedID.editRules'),
      // route: '...',
    },
    {
      iconName: 'people',
      label: t('unifiedID.editRelatedPersons'),
      // route: '...',
    },
  ];

  const handlePress = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      console.log("Button pressed (no route):", item.label);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScreenHeader
        title={t('unifiedID.manageTitle')}
      />
      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </View>
  );
}
