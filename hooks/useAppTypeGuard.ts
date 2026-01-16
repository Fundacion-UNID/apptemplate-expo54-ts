// hooks/useAppTypeGuard.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAppType } from '../context/AppTypeContext';
import { Routes } from '../constants/Routes';

export default function useAppTypeGuard(navigation, expected /* 'family' | 'organization' */) {
  const { appType } = useAppType();
  useFocusEffect(
    useCallback(() => {
      if (!appType || appType !== expected) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: Routes.Landing.name }] })
        );
      }
    }, [appType, expected, navigation])
  );
}
