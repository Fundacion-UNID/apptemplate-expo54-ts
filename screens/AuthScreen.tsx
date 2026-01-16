// screens/Authcreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AccessibleButtonGrid from '../components/AccessibleButtonGrid';
import { Routes } from '../constants/Routes';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();

  // Subject type selected previously: 'family' or 'organization'
  const subjectType = route.params?.subjectType || 'family';
  const isOrg = subjectType === 'organization';
  const registerRoute = isOrg ? Routes.Organization.RegisterAuth.name : Routes.Family.Register.name;
  const loginRoute = isOrg ? Routes.Organization.LoginAuth.name : Routes.Family.LoginAuth.name;

  const options = [
    {
      iconName: 'person-add',
      iconType: 'material',
      label: t('register') || 'Register',
      route: registerRoute,
      params: { subjectType, mode: 'register' },
    },
    {
      iconName: 'login',
      iconType: 'material',
      label: t('login') || 'Login',
      route: loginRoute,
      params: { subjectType, mode: 'login' },
    },
  ];

  const handlePress = (item) => {
    navigation.navigate(item.route, item.params);
  };

  return <AccessibleButtonGrid data={options} onPress={handlePress} />;
}
