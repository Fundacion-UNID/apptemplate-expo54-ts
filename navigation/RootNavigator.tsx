
// navigation/RootNavigator.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View, StyleSheet } from 'react-native';
import { NavigationContainer, CommonActions, NavigationState, useNavigationContainerRef } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccessibilityBar from '../components/AccessibilityBar';
import { Routes } from '../constants/Routes';
import NavigatorFamily from './FamNavigator';
import NavigatorOrganization from './OrgNavigator';
import LandingScreen from '../screens/LandingScreen';
import ErrorScreen from '../screens/common/ErrorScreen';
import { useSubject } from '../context/SubjectContext';
import { useAppType } from '../context/AppTypeContext';
import { isJwtExpired } from '../utils/jwt';
import { useProfile } from '../context/ProfileContext';

// --- Navigation Type Definitions ---

// This defines the parameters for each screen in the root stack.
// We are exporting it so that individual screens can use these types.
export type RootStackParamList = {
  [Routes.Landing.name]: undefined;
  [Routes.Family.Auth.name]: undefined; // This is an entry to another navigator
  [Routes.Organization.Auth.name]: undefined; // This is an entry to another navigator

  // Define params for screens that are navigated to directly with params
  // We restore the entityData parameter for the simple navigation flow
  OrgNewRepresentative: { entityData: any, idToken: string }; // TODO: Define a proper type for entityData
  OrgRegistrySent: { thid: string };

  // A global error screen that can be navigated to from anywhere.
  ErrorScreen: { errorMessage: string; retryRoute: string };
  // Add other screens and their params here...
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const navigationRef = useNavigationContainerRef();
  const { accessToken } = useSubject();
  const { appType } = useAppType();
  const { profile } = useProfile();
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);

  const getActiveRouteName = (state?: NavigationState): string | undefined => {
    if (!state) return undefined;
    const route = state.routes[state.index ?? 0];
    if ('state' in route && route.state) {
      return getActiveRouteName(route.state as NavigationState);
    }
    return route.name;
  };

  const publicRoutes = useMemo(() => ({
    common: new Set([Routes.Landing.name, 'ErrorScreen']),
    organization: new Set([
      Routes.Organization.AuthLanding.name,
      Routes.Organization.LoginAuth.name,
      Routes.Organization.RegisterAuth.name,
    ]),
    family: new Set([
      Routes.Family.Auth.name,
      Routes.Family.LoginAuth.name,
      Routes.Family.Register.name,
      Routes.Family.Join.name,
      Routes.Family.New.name,
      Routes.Family.RegistrySent.name,
    ]),
  }), []);

  useEffect(() => {
    if (!currentRouteName || !navigationRef.isReady()) return;
    if (publicRoutes.common.has(currentRouteName)) return;
    if (appType === 'organization' && publicRoutes.organization.has(currentRouteName)) return;
    if (appType === 'family' && publicRoutes.family.has(currentRouteName)) return;

    const tokenExpired = isJwtExpired(accessToken);
    const hasLocalProfile = !!profile;
    if ((!accessToken || tokenExpired) && !hasLocalProfile) {
      const targetRoute =
        appType === 'organization'
          ? Routes.Organization.Auth.name
          : appType === 'family'
            ? Routes.Family.Auth.name
            : Routes.Landing.name;
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: targetRoute }],
        })
      );
    }
  }, [accessToken, appType, currentRouteName, navigationRef, publicRoutes, profile]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => setCurrentRouteName(getActiveRouteName(state))}
    >
      <View style={styles.container}>
        {/* Accessibility controls are now global and outside the navigator */}
        <AccessibilityBar /> 
        
        <Stack.Navigator 
          id="root-stack"
          // The Root navigator should not have a header
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen 
            name={Routes.Landing.name} 
            component={LandingScreen} 
          />

          {/* These screens are entry points to other navigators */}
          <Stack.Screen name={Routes.Family.Auth.name} component={NavigatorFamily} />
          <Stack.Screen name={Routes.Organization.Auth.name} component={NavigatorOrganization} />
          
          {/* A global error screen presented modally */}
          <Stack.Screen 
            name="ErrorScreen"
            component={ErrorScreen} 
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
