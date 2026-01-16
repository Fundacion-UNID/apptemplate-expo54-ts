// screens/LandingScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

// See docs/frontend-guide.md for a detailed explanation of the app's architecture.

import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// --- Hooks, Contexts, and Constants ---
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAppType } from '../context/AppTypeContext';
import { getScreenStyles } from '../constants/Styles';
import { CommonButtons } from '../constants/CommonButtons';

// --- Components ---
import AccessibleButtonGrid, { ButtonItem } from '../components/AccessibleButtonGrid';
import ScreenHeader from '../components/ScreenHeader';

// --- Type Definitions ---
type RootStackParamList = { [key: string]: any; };
type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * LandingScreen Component
 * @returns {React.FC} The landing screen component.
 * @description
 * This component is the main entry point for users, allowing them to select their application type (e.g., Family or Organization).
 * It sets the application type context and navigates to the appropriate authentication flow.
 *
 * It features a responsive grid of buttons that adjusts to screen size and accessibility settings.
 * The buttons are defined in a centralized `CommonButtons` file to promote reusability and maintainability.
 * The component is fully typed with TypeScript for better development experience and code quality.
 */
const LandingScreen: FC = () => {
    const { setAppType } = useAppType();
    const navigation = useNavigation<LandingScreenNavigationProp>();
    const { t } = useTranslation();
  
    /**
     * @function handlePress
     * @description
     * This function is the handler for the button press event on the AccessibleButtonGrid.
     * It sets the application type if it's provided in the button item and navigates to the specified route.
     * 
     * @param {ButtonItem} item - The button item that was pressed.
     */
    const handlePress = (item: ButtonItem) => {
      if (item.appType) {
        setAppType(item.appType);
      }
      if (item.route) {
        navigation.navigate(item.route);
      }
    };

  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  // Get button configuration from the central file
  const buttons: ButtonItem[] = CommonButtons(t).landing;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('landing.title')}
        subtitle={t('landing.subtitle')}
        description={t('landing.description')}
      />

      <AccessibleButtonGrid data={buttons} onPress={handlePress} />
    </ScrollView>
  );
}

export default LandingScreen;
