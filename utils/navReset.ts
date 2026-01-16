// utils/navReset.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { CommonActions } from '@react-navigation/native';
import { Routes } from '../constants/Routes';

export const resetTo = (navigation, routeName, params = undefined) =>
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );

export const resetToLanding = (navigation) => resetTo(navigation, Routes.Landing.name);
