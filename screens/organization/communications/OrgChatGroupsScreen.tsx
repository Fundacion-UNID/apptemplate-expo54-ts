// screens/organization/communications/OrgChatGroupsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, useState, useLayoutEffect } from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../../hooks/useThemeColor';
import AccessibleConnectionsGrid from '../../../components/AccessibleConnectionsGrid';
import { demoConnectionsList } from '../../../demo/connections.data';

export default function OrgChatGroupsScreen({ navigation }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('organization.screens.communications.title'),
      headerShown: true,
    });
  }, [navigation, t]);

  // Filter logic based on search query
  const filteredData = useMemo(() => {
    const translatedData = demoConnectionsList.map(item => ({
      ...item,
      groupName: t(`organization.screens.communications.connections.${item.groupName.replace(/\s/g, '')}`),
    }));

    if (!query) return translatedData;
    const lowerCaseQuery = query.toLowerCase();
    return translatedData.filter(item =>
      item.groupName?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, t]);

  const handleSearch = (q) => setQuery(q);
  const handleAdd = () => {
    navigation.navigate('OrgAddConnection');
  };

  const handlePressGroup = (group) => {
    navigation.navigate('Chat', {
      connectionId: group.id,
      connectionName: group.groupName,
    });
  };
  
  const background = useThemeColor({}, 'background');

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <AccessibleConnectionsGrid
        data={filteredData}
        onPress={handlePressGroup}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onOptionsPress={(item) => {
          Alert.alert(
            'Connection Options',
            `Group: ${item.groupName}\nStatus: ${item.status || 'n/a'}`
          );
        }}
      />
    </View>
  );
}
