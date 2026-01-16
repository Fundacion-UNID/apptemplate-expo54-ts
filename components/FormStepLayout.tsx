// components/FormStepLayout.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import { getScreenStyles } from '../constants/Styles';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';

import ScreenHeader from './ScreenHeader';
import ThemedButton from './ThemedButton';

interface FormStepLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  children: (columnCount: number) => React.ReactNode;
  onContinue: () => void;
  isContinueEnabled: boolean;
  isLoading?: boolean;
}

export default function FormStepLayout({
  title,
  subtitle,
  description,
  children,
  onContinue,
  isContinueEnabled,
  isLoading = false,
}: FormStepLayoutProps) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get('window').width;
      setColumnCount(width > 800 ? 3 : width > 500 ? 2 : 1);
    };

    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={title} subtitle={subtitle} description={description} />
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {children(columnCount)}
        </View>

        <View style={{ padding: 16 }}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <ThemedButton
              title={t('common.continue')}
              onPress={onContinue}
              disabled={!isContinueEnabled}
              accessibilityRole="button"
              accessibilityLabel={t('common.continue')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
