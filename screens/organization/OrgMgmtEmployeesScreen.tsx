// screens/organization/OrgMgmtEmployeesScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { getIscoRoleLabelKey, roles as roleGroups, professionalRoles } from '../../constants/Roles';
import { useJobs } from '../../context/JobContext';
import { ClaimsPersonSchemaorg } from '../../constants/Schemas';
import * as Crypto from 'expo-crypto';
import { claimsToDataEntry } from '../../utils/dataEntry';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';
import DraftSummary from '../../components/DraftSummary';

const Tab = ({ title, isActive, onPress }) => {
  const activeColor = useThemeColor({}, 'tint');
  const inactiveColor = useThemeColor({}, 'background');
  const activeTextColor = useThemeColor({}, 'background');
  const inactiveTextColor = useThemeColor({}, 'text');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  return (
    <Pressable
      onPress={onPress}
      style={[
        isActive ? styles.activeTab : styles.inactiveTab,
        { backgroundColor: isActive ? activeColor : inactiveColor },
      ]}
    >
      <ThemedText style={[{ color: isActive ? activeTextColor : inactiveTextColor }, styles.activeTabText]}>
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default function OrgMgmtEmployeesScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const tintColor = useThemeColor({}, 'tint');
  const styles = getScreenStyles(scaleFactor, tintColor);
  const componentStyles = getComponentStyles(scaleFactor, useThemeColor);
  const backgroundColor = useThemeColor({}, 'background');

  const screenType = 'manageEmployees';
  const i18nPath = `organization.screens.${screenType}`;

  const { draftJobs, createOrUpdateDraftJob, sync } = useJobs();
  const draftEmployees = useMemo(() => {
    const draft = draftJobs.find(job => (job as any)?.content?.resourceType === 'employees');
    const data = (draft as any)?.content?.payload?.data;
    return Array.isArray(data) ? data : [];
  }, [draftJobs]);

  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null); // null | { found: boolean, email: string }
  const [role, setRole] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [activeTab, setActiveTab] = useState('myOrganization'); // 'myOrganization' | 'anotherOrganization'

  const handleSearch = () => {
    if (!searchEmail) return;
    console.log(`Searching for ${searchEmail} in context: ${activeTab}`);
    setSearchResult({ found: false, email: searchEmail });
  };

  const handleAddEmployee = async () => {
    if (!searchResult || searchResult.found || !role) return;
    
    const emailToAdd = searchResult.email;
    const isDuplicate = draftEmployees.some(emp => emp.meta.claims[ClaimsPersonSchemaorg.email] === emailToAdd);
    if (isDuplicate) {
      console.log("Employee already in draft.");
      setSearchEmail('');
      setSearchResult(null);
      return;
    }

    const roleParts = role.split('.');
    const hasOccupationValue = roleParts.slice(-2).join(':').toUpperCase();

    const employeeClaims = {
      [ClaimsPersonSchemaorg.email]: emailToAdd,
      [ClaimsPersonSchemaorg.hasOccupation]: hasOccupationValue,
      [ClaimsPersonSchemaorg.memberOf]: selectedGroupId ? [selectedGroupId] : [],
    };

    const newEmployee = claimsToDataEntry(
      'Employee-registration-form-v1.0',
      employeeClaims,
      { context: 'org.schema', schemaType: 'Person' }
    );
    
    const updatedEmployees = [...draftEmployees, newEmployee];
    
    try {
      await createOrUpdateDraftJob({
        resourceType: 'employees',
        payload: { "data": updatedEmployees },
      });
      
      setSearchEmail('');
      setSearchResult(null);
      setRole('');
      setSelectedGroupId('');
    } catch (error) {
      console.error("Error updating employee draft:", error);
    }
  };

  const handleRemoveEmployee = async (id) => {
    const updatedEmployees = draftEmployees.filter(emp => emp.id !== id);
    try {
      await createOrUpdateDraftJob({
        resourceType: 'employees',
        payload: { "data": updatedEmployees },
      });
    } catch (error) {
      console.error("Error updating employee draft:", error);
    }
  };
  
  const handleSyncDraft = () => {
    sync();
  };
  
  const roleItems = professionalRoles.map((roleKey) => ({
    value: roleKey,
    label: t(getIscoRoleLabelKey(roleKey), roleKey),
  }));
  
  const availableGroups = [
      { name: 'Admins', id: 'did:web:example.com:group:admins' },
      { name: 'Nurses', id: 'did:web:example.com:group:nurses' }
  ];

  const summaryItems = draftEmployees.map(emp => ({
    id: emp.id,
    iconName: 'person',
    primaryText: emp.meta.claims[ClaimsPersonSchemaorg.email],
    secondaryText: t(getIscoRoleLabelKey(emp.meta.claims[ClaimsPersonSchemaorg.hasOccupation]), '')
  }));

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t(`${i18nPath}.title`)}
          subtitle={t(`${i18nPath}.subtitle`)}
        />
        
        <View style={{ padding: 16 }}>
          {/* --- Tabs for Context --- */}
          <View style={styles.tabGroupContainer}>
              <View style={styles.tabGroup}>
                  <Tab
                      title="My Organization"
                      isActive={activeTab === 'myOrganization'}
                      onPress={() => setActiveTab('myOrganization')}
                  />
                  <Tab
                      title="Another Organization"
                      isActive={activeTab === 'anotherOrganization'}
                      onPress={() => setActiveTab('anotherOrganization')}
                  />
              </View>
          </View>

          {/* --- Search Input --- */}
          <ThemedText style={componentStyles.label}>{t('common.input-email-label')}</ThemedText>
          <ThemedInput
            placeholder={t('common.input-email-placeholder')}
            value={searchEmail}
            onChangeText={setSearchEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedText style={componentStyles.label}>{t('common.picker-role-label')}</ThemedText>
          <ThemedPicker
            selectedValue={role}
            onValueChange={setRole}
            items={[{ label: t('common.picker-role-placeholder'), value: '' }, ...roleItems]}
          />

          <ThemedButton
            title={t('common.search')}
            onPress={handleSearch}
            style={{ marginTop: 8 }}
            disabled={!searchEmail || !role}
          />

          {/* --- Search Result --- */}
          {searchResult && (
            <View style={{ marginTop: 24 }}>
              <ThemedText style={{fontWeight: 'bold'}}>
                {`Result for "${searchResult.email}" with role "${t(getIscoRoleLabelKey(role), role)}":`}
              </ThemedText>
              
              {searchResult.found ? (
                 <ThemedText>Employee was found.</ThemedText>
              ) : (
                <>
                  <ThemedText>Employee not found.</ThemedText>
                  
                  {activeTab === 'myOrganization' && (
                    <View>
                      <ThemedText style={{marginTop: 8}}>You can add them to your organization's draft below.</ThemedText>
                      
                      <ThemedText style={componentStyles.label}>{t(`${i18nPath}.groupsLabel`)}</ThemedText>
                      <ThemedPicker
                        selectedValue={selectedGroupId}
                        onValueChange={(itemValue) => setSelectedGroupId(itemValue)}
                        items={[{ label: 'No group', value: '' }, ...availableGroups.map(g => ({ label: g.name, value: g.id }))]}
                      />

                      <ThemedButton
                        title={t(`${i18nPath}.addEmployee`)}
                        onPress={handleAddEmployee}
                        style={{ marginTop: 16 }}
                      />
                    </View>
                  )}

                  {activeTab === 'anotherOrganization' && (
                     <ThemedButton
                       title="Add to Contacts"
                       onPress={() => console.log('Adding to local contacts...')}
                       style={{ marginTop: 16 }}
                     />
                  )}
                </>
              )}
            </View>
          )}
        </View>

        {/* --- Draft Section (only for My Organization) --- */}
        {activeTab === 'myOrganization' && (
          <>
            <DraftSummary
              title={t(`${i18nPath}.draftTitle`)}
              items={summaryItems}
              onRemoveItem={handleRemoveEmployee}
            />
            
            {draftEmployees.length > 0 && (
              <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
                <ThemedButton
                  title={t(`${i18nPath}.sendRequest`)}
                  onPress={handleSyncDraft}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const getComponentStyles = (scaleFactor, useThemeColor) => {
  const textColor = useThemeColor({}, 'text');
  return StyleSheet.create({
    label: {
      fontSize: 16 * scaleFactor,
      color: textColor,
      marginBottom: 8,
      marginTop: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    listHeader: {
        fontSize: 18 * scaleFactor,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
  });
};
