// screens/common/ErrorScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { Routes } from '../../constants/Routes';

type RootStackParamList = {
  ErrorScreen: {
    errorMessage: string;
    retryRoute: string; // The name of the screen to navigate to on retry.
  };
  [key: string]: any;
};

type ErrorScreenRouteProp = RouteProp<RootStackParamList, 'ErrorScreen'>;

export default function ErrorScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ErrorScreenRouteProp>();
  const { errorMessage, retryRoute } = route.params;

  const screenStyles = getScreenStyles();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const handleRetry = () => {
    // The retryRoute param is now the exact name of the screen.
    if (retryRoute) {
      // We use `as any` because the generic navigator doesn't know about
      // routes in nested navigators. This is a safe assertion because the
      // calling screen is responsible for providing a valid route name.
      navigation.navigate(retryRoute as any);
    } else {
      // Fallback if no retry route is provided.
      handleGoHome();
    }
  };
  
  const handleGoHome = () => {
    // Navigate to the absolute root of the app, which is always safe.
    navigation.navigate(Routes.Landing.name);
  };

  return (
    <View style={[screenStyles.container, { backgroundColor, justifyContent: 'center' }]}>
      <ScreenHeader
              title={t('common.error')}
              subtitle={t('common.unexpectedError')}
              description={undefined}
      />
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <ThemedText style={[screenStyles.body, { textAlign: 'center', marginBottom: 32, opacity: 0.8 }]}>
          {errorMessage}
        </ThemedText>
        
        <ThemedButton
          title={t('common.retry')}
          onPress={handleRetry}
          accessibilityLabel={t('common.retry')}
          accessibilityRole="button"
        />
        <ThemedButton
          title={t('common.goHome')}
          onPress={handleGoHome}
          style={{ 
            marginTop: 16,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: tintColor,
          }}
          // NOTE: ThemedButton does not currently support overriding text color.
          // For a true "outline" style, the component would need to be enhanced.
          // This implementation provides the correct shape and border.
          accessibilityLabel={t('common.goHome')}
          accessibilityRole="button"
        />
      </View>
    </View>
  );
}
