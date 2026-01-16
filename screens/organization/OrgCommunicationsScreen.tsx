// screens/organization/OrgCommunicationsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import { OrgButtons } from '../../constants/OrgButtons';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';

export default function OrgCommunicationsScreen() {
  const screenType = 'communications';
  const i18nPath = `organization.screens.${screenType}`;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const buttons = OrgButtons(t)[screenType];

  const handlePress = (item) => {
    navigation.navigate(item.route);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ScreenHeader
        title={t(`${i18nPath}.title`)}
        subtitle={t(`${i18nPath}.subtitle`)}
        description={t(`${i18nPath}.description`)}
      />
      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}
