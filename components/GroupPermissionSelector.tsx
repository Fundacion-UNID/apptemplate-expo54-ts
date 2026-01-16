// components/GroupPermissionSelector.js
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDirectory } from '../context/DirectoryContext';
import { useThemeColor } from '../hooks/useThemeColor';

import ThemedText from './ThemedText';
import ThemedCheckbox from './ThemedCheckbox';

const GroupPermissionSelector = ({ onSelectionChange }) => {
  const { t } = useTranslation();
  const { allGroups, isDirectoryReady } = useDirectory();
  const borderColor = useThemeColor({}, 'border');
  
  const [selectedGroupIds, setSelectedGroupIds] = useState(new Set());

  const handleToggleGroup = (groupId) => {
    const newSelection = new Set(selectedGroupIds);
    if (newSelection.has(groupId)) {
      newSelection.delete(groupId);
    } else {
      newSelection.add(groupId);
    }
    setSelectedGroupIds(newSelection);
    onSelectionChange(Array.from(newSelection));
  };

  if (!isDirectoryReady) {
    return <ThemedText>{t('common.loading', 'Loading...')}</ThemedText>;
  }

  if (allGroups.length === 0) {
    return <ThemedText>{t('components.groupPermissionSelector.noGroups', 'No professional groups have been created yet.')}</ThemedText>;
  }

  return (
    <View>
      <ThemedText variant="subtitle">{t('components.groupPermissionSelector.title', 'Assign Professional Groups')}</ThemedText>
      <ThemedText style={{ opacity: 0.8, marginBottom: 12 }}>
        {t('components.groupPermissionSelector.subtitle', 'Select the groups that will have access to this connection.')}
      </ThemedText>
      <View style={{ borderWidth: 1, borderColor, borderRadius: 8 }}>
        {allGroups.map((group, index) => (
          <Pressable
            key={group.id}
            onPress={() => handleToggleGroup(group.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderBottomWidth: index === allGroups.length - 1 ? 0 : 1,
              borderBottomColor: borderColor,
            }}
            accessible
            accessibilityRole="button"
            accessibilityLabel={group.meta.claims.name}
            accessibilityState={{ checked: selectedGroupIds.has(group.id) }}
          >
            <ThemedCheckbox
              checked={selectedGroupIds.has(group.id)}
              onToggle={() => handleToggleGroup(group.id)}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <ThemedText style={{ fontWeight: '600' }}>{group.meta.claims.name}</ThemedText>
              {group.meta.claims.description && (
                <ThemedText style={{ opacity: 0.7, fontSize: 12, marginTop: 2 }}>
                  {group.meta.claims.description}
                </ThemedText>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default GroupPermissionSelector;
