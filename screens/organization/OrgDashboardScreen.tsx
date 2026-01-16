// screens/organization/OrgDashboardScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { useTranslation } from 'react-i18next';

import AccessibleButtonGrid, { ButtonItem } from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import ConfirmationModal from '../../components/ConfirmationModal';
import { OrgButtons } from '../../constants/OrgButtons';
import { getScreenStyles } from '../../constants/Styles';
import { Routes } from '../../constants/Routes';

// Define a basic type for the navigation prop for this screen.
type OrgDashboardScreenNavigationProp = {
  navigate: (routeName: string) => void;
  addListener: (event: 'beforeRemove', callback: (e: any) => void) => () => void;
  removeListener: (event: 'beforeRemove', callback: (e: any) => void) => void;
};

type OrgDashboardScreenProps = {
  navigation: OrgDashboardScreenNavigationProp;
};

const OrgDashboardScreen: React.FC<OrgDashboardScreenProps> = ({ navigation }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const { shutdownSession } = useProfile();
  const styles = getScreenStyles(scaleFactor);

  const screenType = 'dashboard';
  const i18nPath = `organization.screens.${screenType}`;
  const { t } = useTranslation();
  const buttons: ButtonItem[] = OrgButtons(t)[screenType];

  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Show our custom modal
        setModalVisible(true);
      };

      navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [navigation])
  );

  const handleConfirmExit = () => {
    setModalVisible(false);
    shutdownSession(); // Use the shutdown function from the context
    navigation.navigate(Routes.Landing.name);
  };

  const handleCancelExit = () => {
    setModalVisible(false);
  };

  const handlePress = (item: ButtonItem) => {
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
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
      <ConfirmationModal
        visible={isModalVisible}
        title={t('organization.screens.dashboard.exitConfirm.title')}
        message={t('organization.screens.dashboard.exitConfirm.message')}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        confirmText={t('common.exit')}
        cancelText={t('common.cancel')}
      />
    </>
  );
};

export default OrgDashboardScreen;
